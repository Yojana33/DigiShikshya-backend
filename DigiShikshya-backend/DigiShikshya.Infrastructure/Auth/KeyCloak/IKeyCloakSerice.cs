// IKeycloakService.cs

public interface IKeycloakService
{
    Task<(string AccessToken, string RefreshToken)> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default);
    Task<bool> LogoutAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<List<User>> GetUsersByRoleAsync(string roleName, CancellationToken cancellationToken = default);
    Task<(string AccessToken, string RefreshToken)> GetNewAccessByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<User> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    
}