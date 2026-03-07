using System.Security.Claims;
using System.Text;
using Application.Common;
using Application.Common.Interfaces;
using Common.Authentication;
using Contracts.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"] ??
                        throw new InvalidOperationException("Invalid Jwt secret"))),
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
                    }
                };
            });

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.Jwt));
        services.AddScoped<ITokenManager, TokenManager>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
