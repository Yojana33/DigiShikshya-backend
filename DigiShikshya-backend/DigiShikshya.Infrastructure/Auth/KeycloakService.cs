using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Net.Http.Headers;

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

        // Load Keycloak settings
        _keycloakSettings = configuration.GetSection("KeyCloak").Get<KeycloakSettings>() 
                            ?? throw new ArgumentNullException(nameof(KeycloakSettings), "Keycloak settings are not configured properly.");
    }

    // Private method to get an admin access token using client credentials
    private async Task<string> GetAdminAccessTokenAsync()
    {
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", "client_credentials" }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to get admin access token. Status code: {StatusCode}", response.StatusCode);
            return null;
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            return tokenResponse.GetProperty("access_token").GetString();
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize admin access token response.");
            throw new Exception("Failed to deserialize admin access token response", ex);
        }
    }

    // Authenticate with Keycloak and return the access and refresh tokens
    public async Task<(string AccessToken, string RefreshToken)> AuthenticateAsync(string username, string password)
    {
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", _keycloakSettings.GrantType },
            { "username", username },
            { "password", password }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to authenticate with Keycloak. Status code: {StatusCode}", response.StatusCode);
            return (null, null);
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var refreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken, refreshToken);
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
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "refresh_token", refreshToken }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/logout", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to logout from Keycloak. Status code: {StatusCode}", response.StatusCode);
            return false;
        }

        return true;
    }

    // Get all users assigned to a specific role
    public async Task<List<User>> GetUsersByRoleAsync(string roleName)
    {
        var accessToken = await GetAdminAccessTokenAsync();
        if (string.IsNullOrEmpty(accessToken))
        {
            _logger.LogError("Cannot get users by role because the admin access token is null or empty.");
            return null;
        }

        var request = new HttpRequestMessage(HttpMethod.Get, $"/admin/realms/{_keycloakSettings.Realm}/roles/{roleName}/users");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);

        if (response.IsSuccessStatusCode)
        {
            try
            {
                var users = await response.Content.ReadFromJsonAsync<List<User>>();
                return users;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize users by role response.");
                throw;
            }
        }

        _logger.LogError("Failed to get users by role {RoleName}. Status code: {StatusCode}", roleName, response.StatusCode);
        return null;
    }

    // Use the refresh token to get new access and refresh tokens
    public async Task<(string AccessToken, string RefreshToken)> GetNewAccessByRefreshTokenAsync(string refreshToken)
    {
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", "refresh_token" },
            { "refresh_token", refreshToken }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        var response = await _httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to refresh Keycloak token. Status code: {StatusCode}", response.StatusCode);
            return (null, null);
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var newRefreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken, newRefreshToken);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize Keycloak token refresh response.");
            throw new Exception("Failed to deserialize Keycloak token response", ex);
        }
    }

    // Get user details by user ID
    public async Task<User> GetUserByIdAsync(Guid id)
    {
        var accessToken = await GetAdminAccessTokenAsync();
        if (string.IsNullOrEmpty(accessToken))
        {
            _logger.LogError("Cannot get user because the admin access token is null or empty.");
            return null;
        }

        var request = new HttpRequestMessage(HttpMethod.Get, $"/admin/realms/{_keycloakSettings.Realm}/users/{id}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);

        if (response.IsSuccessStatusCode)
        {
            try
            {
                var user = await response.Content.ReadFromJsonAsync<User>();
                return user;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize user response.");
                throw;
            }
        }

        _logger.LogError("Failed to get user {UserId}. Status code: {StatusCode}", id, response.StatusCode);
        return null;
    }
}

// User class matching Keycloak's UserRepresentation
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public bool Enabled { get; set; }
    public bool EmailVerified { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    // Add other properties as needed
}

// Keycloak settings class to encapsulate configuration
public class KeycloakSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string GrantType { get; set; } = "password";  // Default to password grant
    public string Realm { get; set; } = string.Empty;
}
