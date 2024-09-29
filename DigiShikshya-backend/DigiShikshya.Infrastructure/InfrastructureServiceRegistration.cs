using DigiShikshya.Infrastructure.Hubs;
using DigiShikshya.Infrastructure.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

public static class InfrastructureServiceRegistration
{
    public static void AddInfrastructureServices(this IServiceCollection services)
    {
        //Register database connection
        services.AddScoped<VideoService>();
        services.AddSignalR();



    }


}