public interface IKeyClaokService
{
    Task<(string,string)> AuthenticateAsync(string username, string password);

    Task<bool> RegisterAsync(string id);
}