// KeycloakService.cs
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

public class KeycloakService : IKeycloakService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly KeycloakSettings _keycloakSettings;
    private readonly ILogger<KeycloakService> _logger;

    private const string TokenEndpoint = "/realms/{0}/protocol/openid-connect/token";
    private const string LogoutEndpoint = "/realms/{0}/protocol/openid-connect/logout";
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

    private HttpClient CreateHttpClient()
    {
        var client = _httpClientFactory.CreateClient("KeycloakClient");
        client.BaseAddress = new Uri(_keycloakSettings.Url!);
        return client;
    }

    public async Task<(string AccessToken, string RefreshToken)> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Username is required.", nameof(username));
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password is required.", nameof(password));

        var httpClient = CreateHttpClient();
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", password },
            { "username", username },
            { "password", password }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var response = await httpClient.PostAsync(string.Format(TokenEndpoint, _keycloakSettings.Realm), requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Authentication failed. Status code: {StatusCode}, Response: {Response}", response.StatusCode, errorContent);
                throw new InvalidOperationException("Authentication failed.");
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var refreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken!, refreshToken!);
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

        var httpClient = CreateHttpClient();
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "refresh_token", refreshToken }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var response = await httpClient.PostAsync(string.Format(LogoutEndpoint, _keycloakSettings.Realm), requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Logout failed. Status code: {StatusCode}, Response: {Response}", response.StatusCode, errorContent);
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

    try
    {
        var accessToken = await GetAdminAccessTokenAsync(cancellationToken);
        if (string.IsNullOrEmpty(accessToken))
        {
            _logger.LogError("Admin access token is unavailable.");
            throw new InvalidOperationException("Failed to obtain admin access token.");
        }

        using var httpClient = CreateHttpClient();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        // Get users directly using the role name
        var getUsersEndpoint = $"/admin/realms/{_keycloakSettings.Realm}/roles/{roleName}/users";
        
        var response = await httpClient.GetAsync(getUsersEndpoint, cancellationToken);
        
        if (response.IsSuccessStatusCode)
        {
            var users = await response.Content.ReadFromJsonAsync<List<User>>(cancellationToken: cancellationToken) 
                ?? new List<User>();
            
            _logger.LogInformation("Successfully retrieved {Count} users for role {RoleName}", 
                users.Count, roleName);
            
            return users;
        }
        
        var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
        _logger.LogError("Failed to retrieve users for role {RoleName}. Status code: {StatusCode}, Response: {Response}",
            roleName, response.StatusCode, errorContent);
            
        throw new InvalidOperationException($"Failed to retrieve users for role {roleName}. Status code: {response.StatusCode}");
    }
    catch (HttpRequestException ex)
    {
        _logger.LogError(ex, "HTTP request failed while retrieving users for role {RoleName}", roleName);
        throw new InvalidOperationException($"Failed to communicate with Keycloak while retrieving users for role {roleName}.", ex);
    }
    catch (JsonException ex)
    {
        _logger.LogError(ex, "Failed to deserialize users response for role {RoleName}", roleName);
        throw new InvalidOperationException($"Invalid response from Keycloak when retrieving users for role {roleName}.", ex);
    }
    catch (Exception ex) when (ex is not InvalidOperationException and not ArgumentException)
    {
        _logger.LogError(ex, "Unexpected error while retrieving users for role {RoleName}", roleName);
        throw;
    }
}

    public async Task<(string AccessToken, string RefreshToken)> GetNewAccessByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new ArgumentException("Refresh token is required.", nameof(refreshToken));

        var httpClient = CreateHttpClient();
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
            var response = await httpClient.PostAsync(string.Format(TokenEndpoint, _keycloakSettings.Realm), requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Token refresh failed. Status code: {StatusCode}, Response: {Response}", response.StatusCode, errorContent);
                throw new InvalidOperationException("Token refresh failed.");
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();
            var newRefreshToken = tokenResponse.GetProperty("refresh_token").GetString();
            return (accessToken!, newRefreshToken!);
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
            throw new InvalidOperationException("Failed to obtain admin access token.");
        }

        var httpClient = CreateHttpClient();
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

            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Failed to retrieve user with ID {UserId}. Status code: {StatusCode}, Response: {Response}", id, response.StatusCode, errorContent);
            throw new InvalidOperationException($"Failed to retrieve user with ID {id}.");
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
        var httpClient = CreateHttpClient();
        var formData = new Dictionary<string, string>
        {
            { "client_id", _keycloakSettings.ClientId },
            { "client_secret", _keycloakSettings.ClientSecret },
            { "grant_type", "client_credentials" }
        };

        var requestBody = new FormUrlEncodedContent(formData);

        try
        {
            var tokenUrl = string.Format(TokenEndpoint, _keycloakSettings.Realm);
            var response = await httpClient.PostAsync(tokenUrl, requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Failed to obtain admin access token. Status code: {StatusCode}, Response: {Response}", response.StatusCode, errorContent);
                throw new InvalidOperationException("Failed to obtain admin access token.");
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            return tokenResponse.GetProperty("access_token").GetString()!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while obtaining admin access token.");
            throw;
        }
    }
}