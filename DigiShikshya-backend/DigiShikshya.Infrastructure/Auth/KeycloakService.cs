using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class KeycloakService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<KeycloakService> _logger;
    private readonly KeycloakSettings _keycloakSettings;

    public KeycloakService(HttpClient httpClient, IConfiguration configuration, ILogger<KeycloakService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        // Load keycloak settings only once to improve performance
        _keycloakSettings = configuration.GetSection("KeyCloak").Get<KeycloakSettings>()!;
    }

    // Authenticate with Keycloak and return the access and refresh tokens
    public async Task<(string, string)> AuthenticateAsync(string username, string password)
    {
        var requestBody = new StringContent(
            $"client_id={_keycloakSettings.ClientId}&client_secret={_keycloakSettings.ClientSecret}&grant_type={_keycloakSettings.GrantType}&username={username}&password={password}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to authenticate with Keycloak. Status code: {StatusCode}", response.StatusCode);
            return (null, null)!;
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var refreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken!, refreshToken!);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize Keycloak token response.");
            throw new Exception("Failed to deserialize Keycloak token response", ex);
        }
    }

    // Log out from Keycloak and invalidate the refresh token
    public async Task<bool> LogoutAsync(string refreshToken)
    {
        var requestBody = new StringContent(
            $"client_id={_keycloakSettings.ClientId}&client_secret={_keycloakSettings.ClientSecret}&refresh_token={refreshToken}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/logout", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to logout from Keycloak. Status code: {StatusCode}", response.StatusCode);
        }

        return response.IsSuccessStatusCode;
    }

    // Use the refresh token to get new access and refresh tokens
    public async Task<(string, string)> GetNewAccessByRefreshToken(string refreshToken)
    {
        var requestBody = new StringContent(
            $"client_id={_keycloakSettings.ClientId}&client_secret={_keycloakSettings.ClientSecret}&grant_type=refresh_token&refresh_token={refreshToken}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to refresh Keycloak token. Status code: {StatusCode}", response.StatusCode);
            return (null, null)!;
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var newRefreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken!, newRefreshToken!);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize Keycloak token refresh response.");
            throw new Exception("Failed to deserialize Keycloak token response", ex);
        }
    }

    // Register the user in the system by adding them to the user repository
    // public async Task<bool> RegisterAsync(string id)
    // {
    //     try
    //     {
    //         return await _userRepository.AddUserWhenLoggedIn(id);
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Failed to register user {UserId}", id);
    //         return false;
    //     }
    // }
}

// Keycloak settings class to encapsulate configuration
public class KeycloakSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string GrantType { get; set; } = "password";  // Default to password grant
    public string Realm { get; set; } = string.Empty;
}
