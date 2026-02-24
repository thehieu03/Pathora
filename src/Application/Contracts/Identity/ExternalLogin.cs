namespace Application.Contracts.Identity;

public sealed record ExternalLoginRequest(string ProviderEmail, string FullName);

public sealed record ExternalLoginResponse(string AccessToken, string RefreshToken);

