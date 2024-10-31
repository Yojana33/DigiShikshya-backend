// KeycloakService.cs
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

public class KeycloakService : IKeycloakService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly KeycloakSettings _keycloakSettings;
    private readonly ILogger<KeycloakService> _logger;
    
    private const string TokenEndpoint = "/protocol/openid-connect/token";
    private const string LogoutEndpoint = "/protocol/openid-connect/logout";
    private const string UsersByRoleEndpointTemplate = "/admin/realms/{0}/roles/{1}/users";
    private const string UserByIdEndpointTemplate = "/admin/realms/{0}/users/{1}";

    public KeycloakService(
        IHttpClientFactory httpClientFactory,
        IOptions<KeycloakSettings> keycloakOptions,
        ILogger<KeycloakService> logger)
    {
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _keycloakSettings = keycloakOptions?.Value ?? throw new ArgumentNullException(nameof(keycloakOptions));
        _keycloakSettings.Validate();
    }

   
    public async Task<(string AccessToken, string RefreshToken)> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Username is required.", nameof(username));
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password is required.", nameof(password));

        var httpClient = _httpClientFactory.CreateClient("KeycloakClient");
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", _keycloakSettings.GrantType },
            { "username", username },
            { "password", password }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var response = await httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}{TokenEndpoint}", requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Authentication failed. Status code: {StatusCode}", response.StatusCode);
                return (null, null)!;
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var refreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken, refreshToken)!;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize authentication response.");
            throw new InvalidOperationException("Invalid response from Keycloak during authentication.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during authentication.");
            throw;
        }
    }

  
    public async Task<bool> LogoutAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new ArgumentException("Refresh token is required.", nameof(refreshToken));

        var httpClient = _httpClientFactory.CreateClient("KeycloakClient");
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "refresh_token", refreshToken }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var response = await httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}{LogoutEndpoint}", requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Logout failed. Status code: {StatusCode}", response.StatusCode);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during logout.");
            throw;
        }
    }

    public async Task<List<User>> GetUsersByRoleAsync(string roleName, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(roleName))
            throw new ArgumentException("Role name is required.", nameof(roleName));

        var accessToken = await GetAdminAccessTokenAsync(cancellationToken);
        if (string.IsNullOrEmpty(accessToken))
        {
            _logger.LogError("Admin access token is unavailable.");
            return new List<User>();
        }

        var httpClient = _httpClientFactory.CreateClient("KeycloakClient");
        var endpoint = string.Format(UsersByRoleEndpointTemplate, _keycloakSettings.Realm, roleName);
        var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        try
        {
            var response = await httpClient.SendAsync(request, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var users = await response.Content.ReadFromJsonAsync<List<User>>(cancellationToken: cancellationToken);
                return users ?? new List<User>();
            }

            _logger.LogError("Failed to retrieve users for role {RoleName}. Status code: {StatusCode}", roleName, response.StatusCode);
            return new List<User>();
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize users by role response.");
            throw new InvalidOperationException("Invalid response from Keycloak when retrieving users by role.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving users by role.");
            throw;
        }
    }

    
    public async Task<(string AccessToken, string RefreshToken)> GetNewAccessByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new ArgumentException("Refresh token is required.", nameof(refreshToken));

        var httpClient = _httpClientFactory.CreateClient("KeycloakClient");
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", "refresh_token" },
            { "refresh_token", refreshToken }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var response = await httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}{TokenEndpoint}", requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Token refresh failed. Status code: {StatusCode}", response.StatusCode);
                return (null, null)!;
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var newRefreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken, newRefreshToken)!;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize token refresh response.");
            throw new InvalidOperationException("Invalid response from Keycloak during token refresh.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during token refresh.");
            throw;
        }
    }

    
    public async Task<User> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("User ID is required.", nameof(id));

        var accessToken = await GetAdminAccessTokenAsync(cancellationToken);
        if (string.IsNullOrEmpty(accessToken))
        {
            _logger.LogError("Admin access token is unavailable.");
            return null!;
        }

        var httpClient = _httpClientFactory.CreateClient("KeycloakClient");
        var endpoint = string.Format(UserByIdEndpointTemplate, _keycloakSettings.Realm, id);
        var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        try
        {
            var response = await httpClient.SendAsync(request, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<User>(cancellationToken: cancellationToken);
                return user!;
            }

            _logger.LogError("Failed to retrieve user with ID {UserId}. Status code: {StatusCode}", id, response.StatusCode);
            return null!;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize user response.");
            throw new InvalidOperationException("Invalid response from Keycloak when retrieving user by ID.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving user by ID.");
            throw;
        }
    }

   
    private async Task<string> GetAdminAccessTokenAsync(CancellationToken cancellationToken)
    {
        var httpClient = _httpClientFactory.CreateClient("KeycloakClient");
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", "client_credentials" }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var response = await httpClient.PostAsync($"/realms/{_keycloakSettings.Realm}{TokenEndpoint}", requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to obtain admin access token. Status code: {StatusCode}", response.StatusCode);
                return null!;
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            return tokenResponse.GetProperty("access_token").GetString()!;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize admin access token response.");
            throw new InvalidOperationException("Invalid response from Keycloak when obtaining admin access token.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while obtaining admin access token.");
            throw;
        }
    }
}