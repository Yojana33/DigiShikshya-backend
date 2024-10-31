// KeycloakSettings.cs
public class KeycloakSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string GrantType { get; set; } = "password"; // Default to password grant
    public string Realm { get; set; } = string.Empty;
    
    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(ClientId))
            throw new ArgumentException("ClientId is required.");
        if (string.IsNullOrWhiteSpace(ClientSecret))
            throw new ArgumentException("ClientSecret is required.");
        if (string.IsNullOrWhiteSpace(Realm))
            throw new ArgumentException("Realm is required.");
    }
}