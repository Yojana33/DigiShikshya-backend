public interface IAuthRepository
{
    Task<string> AuthenticateAsync(string username, string password);
}