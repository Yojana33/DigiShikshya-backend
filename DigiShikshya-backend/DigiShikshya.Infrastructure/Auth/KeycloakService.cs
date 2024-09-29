
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

public class KeycloakService (HttpClient httpClient, IConfiguration configuration): IAuthRepository
{
    

    public async Task<string> AuthenticateAsync(string username, string password)
    {
        var keyCloakSettings = configuration.GetSection("KeyCloak");

        var requestBody = new StringContent(
            $"client_id={keyCloakSettings["ClientId"]}&client_secret={keyCloakSettings["ClientSecret"]}&grant_type={keyCloakSettings["GrantType"]}&username={username}&password={password}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");

        var response = await httpClient.PostAsync($"{keyCloakSettings["Url"]}/realms/{keyCloakSettings["Realm"]}/protocol/openid-connect/token", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            return null!;
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
        return tokenResponse.GetProperty("access_token").GetString()!;
    }
}