using DigiShikshya.Infrastructure.Hubs;
using DigiShikshya.Infrastructure.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class InfrastructureServiceRegistration
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        //Register database connection
        services.AddScoped<VideoService>();
        services.AddScoped<EmailService>();
        services.AddScoped<SubmissionService>();
        services.AddScoped<KeycloakService>();
        services.AddScoped<KeycloakSettings>();
        services.AddSignalR();
        services.AddHttpClient<KeycloakService>(client =>
        {
                var keycloakUrl = configuration["KeyCloak:Url"];
            client.BaseAddress = new Uri(keycloakUrl!);
        });



    }


}