using System.IdentityModel.Tokens.Jwt;
using System.Linq;

public static class JwtTokenHelper
{
    private static readonly char[] separator = { '[', ']', '"', ',' };

    public static TokenInfo GetTokenInfo(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        var id = jwtToken.Claims
            .FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

        var name = jwtToken.Claims
            .FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;

        var preferredUsername = jwtToken.Claims
            .FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.PreferredUsername)?.Value;

        var email = jwtToken.Claims
            .FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;

        var realmRoles = jwtToken.Claims
            .Where(c => c.Type == "realm_access")
            .SelectMany(c => c.Value.Split(separator, StringSplitOptions.RemoveEmptyEntries))
            .Where(r => r != "roles" && r != "realm_access")
            .ToArray();

        var resourceRoles = jwtToken.Claims
            .Where(c => c.Type == "resource_access")
            .SelectMany(c => c.Value.Split(separator, StringSplitOptions.RemoveEmptyEntries))
            .Where(r => r != "roles" && r != "resource_access")
            .ToArray();

        var roles = realmRoles.Concat(resourceRoles).ToArray();

        return new TokenInfo
        {
            Id = id,
            Name = name,
            PreferredUsername = preferredUsername,
            Email = email,
            Roles = roles
        };
    }
}

public class TokenInfo
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? PreferredUsername { get; set; }
    public string? Email { get; set; }
    public string[]? Roles { get; set; }
}