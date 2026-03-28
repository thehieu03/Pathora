namespace Infrastructure.Identity;

public class JwtOptions
{
    public const string Jwt = "Jwt";
    public string Secret { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public int ExpireInMinutes { get; set; } = 15;
    public int AccessTokenCookieExpirationHours { get; set; } = 1;
    public int RefreshTokenExpirationHours { get; set; } = 168;
}
