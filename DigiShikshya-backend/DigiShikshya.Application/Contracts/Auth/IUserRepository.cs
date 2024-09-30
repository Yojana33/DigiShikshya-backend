public interface IUserRepository
{

    public Task<bool> AddUserWhenLoggedIn (string id);
}