using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;

public class KeycloakService : IKeyClaokService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;

    public KeycloakService(HttpClient httpClient, IConfiguration configuration, IUserRepository userRepository)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _userRepository = userRepository;

    }

    public async Task<(string, string)> AuthenticateAsync(string username, string password)
    {
        var keycloakSettings = _configuration.GetSection("KeyCloak");

        var requestBody = new StringContent(
            $"client_id={keycloakSettings["ClientId"]}&client_secret={keycloakSettings["ClientSecret"]}&grant_type={keycloakSettings["GrantType"]}&username={username}&password={password}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");

        var response = await _httpClient.PostAsync($"/realms/{keycloakSettings["Realm"]}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            return (null, null)!;
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            return (tokenResponse.GetProperty("access_token").GetString(), tokenResponse.GetProperty("refresh_token").GetString())!;
        }
        catch (JsonException)
        {
            throw;
        }
    }

        public async Task<bool> LogoutAsync(string refreshToken)
    {
        var keycloakSettings = _configuration.GetSection("KeyCloak");
    
        var requestBody = new StringContent(
            $"client_id={keycloakSettings["ClientId"]}&client_secret={keycloakSettings["ClientSecret"]}&refresh_token={refreshToken}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");
    
        var response = await _httpClient.PostAsync($"/realms/{keycloakSettings["Realm"]}/protocol/openid-connect/logout", requestBody);
    
        return response.IsSuccessStatusCode;
    }

    public async Task<(string,string)> GetNewAccessByRefreshToken (string refreshToken)
    {
        var keycloakSettings = _configuration.GetSection("KeyCloak");
    
        var requestBody = new StringContent(
            $"client_id={keycloakSettings["ClientId"]}&client_secret={keycloakSettings["ClientSecret"]}&grant_type=refresh_token&refresh_token={refreshToken}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");
    
        var response = await _httpClient.PostAsync($"/realms/{keycloakSettings["Realm"]}/protocol/openid-connect/token", requestBody);
    
        if (!response.IsSuccessStatusCode)
        {
            return (null, null)!;
        }
    
        var responseContent = await response.Content.ReadAsStringAsync();
    
        try
        {
            var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
            return (tokenResponse.GetProperty("access_token").GetString(), tokenResponse.GetProperty("refresh_token").GetString())!;
        }
        catch (JsonException)
        {
            throw;
        }

    }

    public async Task<bool> RegisterAsync(string id)
    {
        return await _userRepository.AddUserWhenLoggedIn(id);
    }


}
