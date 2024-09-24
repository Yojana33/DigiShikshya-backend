using DigiShikshya.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

public static class InfrastructureServiceRegistration
{
    public static void AddInfrastructureServices(this IServiceCollection services)
    {
        //Register database connection
        services.AddScoped<VideoService>();


    }


}