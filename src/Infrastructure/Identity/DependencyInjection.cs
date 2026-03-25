using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Application.Common;
using Application.Common.Interfaces;
using Common.Authentication;
using Contracts.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ZiggyCreatures.Caching.Fusion;

namespace Infrastructure.Identity;

internal static class DependencyInjection
{
    internal static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var authBuilder = services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(IdentityConstants.ExternalScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);

        var googleClientId = configuration["Authentication:Google:ClientId"];
        var googleClientSecret = configuration["Authentication:Google:ClientSecret"];

        if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
        {
            authBuilder.AddGoogle(options =>
            {
                options.ClientId = googleClientId;
                options.ClientSecret = googleClientSecret;
                options.Scope.Add("email");
                options.Scope.Add("profile");
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            });
        }

        authBuilder.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                var jwtSecret = configuration["Jwt:Secret"];
                if (string.IsNullOrWhiteSpace(jwtSecret))
                {
                    throw new InvalidOperationException(
                        "Missing configuration value 'Jwt:Secret'. Set it in appsettings or environment variables.");
                }

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    ValidIssuers = configuration["Jwt:Issuer"]?.Split(","),
                    ValidAudiences = configuration["Jwt:Audience"]?.Split(","),

                    NameClaimType = ClaimTypes.NameIdentifier
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var token = AuthTokenResolver.Resolve(
                            context.Request.Headers.Authorization.ToString(),
                            context.Request.Cookies["access_token"]);
                        if (!string.IsNullOrWhiteSpace(token))
                        {
                            context.Token = token;
                        }

                        return Task.CompletedTask;
                    },
                    OnTokenValidated = async context =>
                    {
                        var jti = context.Principal?.FindFirst("jti")?.Value;
                        var cache = context.HttpContext.RequestServices.GetRequiredService<IFusionCache>();

                        var value = await cache.GetOrDefaultAsync(
                            $"{CacheKey.AccessToken}:blacklisted:{jti}",
                            string.Empty);
                        if (!string.IsNullOrEmpty(value))
                        {
                            context.Fail("Token is blacklisted");
                        }
                    },
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception is SecurityTokenExpiredException)
                        {
                            // Only write response if the pipeline hasn't started yet.
                            // This prevents "StatusCode cannot be set because the response has already started".
                            if (!context.Response.HasStarted)
                            {
                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                context.Response.ContentType = "application/json";
                                context.Response.WriteAsync(
                                    """{"code":"TOKEN_EXPIRED","message":"Token has expired. Please login again.","statusCode":401}""");
                                context.NoResult();
                            }
                        }

                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        // HandleChallenge is called by AuthorizationMiddleware when auth fails
                        // (missing/invalid token, forbidden, etc.). Guard against writing to an
                        // already-started response (e.g. when OnAuthenticationFailed already wrote).
                        if (context.Response.HasStarted)
                        {
                            context.HandleResponse();
                            return Task.CompletedTask;
                        }

                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";

                        string challengeJson = context.AuthenticateFailure switch
                        {
                            SecurityTokenExpiredException => """{"code":"TOKEN_EXPIRED","message":"Token has expired. Please login again.","statusCode":401}""",
                            _ => string.IsNullOrEmpty(context.Request.Headers.Authorization.ToString())
                                ? """{"code":"TOKEN_MISSING","message":"Authentication required. Please provide a valid token.","statusCode":401}"""
                                : """{"code":"TOKEN_INVALID","message":"Authentication failed. Please check your credentials.","statusCode":401}"""
                        };

                        return context.Response.WriteAsync(challengeJson);
                    }
                };
            });

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.Jwt));
        services.AddScoped<ITokenManager, TokenManager>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
