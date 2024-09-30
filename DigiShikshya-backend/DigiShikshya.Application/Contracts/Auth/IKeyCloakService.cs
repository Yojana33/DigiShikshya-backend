public interface IKeyClaokService
{
    Task<string> AuthenticateAsync(string username, string password);

    Task<bool> RegisterAsync(string id);
}