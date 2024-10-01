using System.Data;
using Dapper;

public class UserRepository : IUserRepository
{
    private readonly IDbConnection dbConnection;

    public UserRepository(IDbConnection dbConnection)
    {
        this.dbConnection = dbConnection;
    }

    public async Task<bool> AddUserWhenLoggedIn(string id)
    {
        var query = @"
            INSERT INTO userprofile (user_id, has_logged_in)
            VALUES (@user_id, @has_logged_in)
            ON CONFLICT (user_id)
            DO UPDATE SET has_logged_in = EXCLUDED.has_logged_in
            WHERE userprofile.has_logged_in = false;
        ";
        Console.WriteLine(id);
        await dbConnection.ExecuteAsync(query, new { user_id = Guid.Parse(id), has_logged_in = true });
        return true;
    }
}