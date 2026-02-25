using System.Security.Claims;
using System.Text;
using Application.Common;
using Application.Common.Interfaces;
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
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(IdentityConstants.ExternalScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddGoogle(options =>
            {
                options.ClientId = configuration["Authentication:Google:ClientId"] ??
                                   throw new InvalidOperationException("Invalid Google Client ID");
                options.ClientSecret = configuration["Authentication:Google:ClientSecret"] ??
                                       throw new InvalidOperationException("Invalid Google Client Secret");
                options.Scope.Add("email");
                options.Scope.Add("profile");
            })
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
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

