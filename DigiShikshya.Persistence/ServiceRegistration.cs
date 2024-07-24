
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;



public static class ServiceRegistration
{
    public static void AddPersistenceServices(this IServiceCollection services, string connectionString)
    {
        //Register database connection
        services.AddScoped<IDbConnection>(x => new NpgsqlConnection(connectionString));


        // Register repositories
        
        // services.AddScoped<IUserRepository, UserRepository>();
        // Register other repositories and services here
    }
}

