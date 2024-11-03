using DigiShikshya.Infrastructure.Hubs;
using DigiShikshya.Infrastructure.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class InfrastructureServiceRegistration
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register database connection
        services.AddScoped<VideoService>();
        services.AddScoped<EmailService>();
        services.AddScoped<SubmissionService>();

        // Register Keycloak settings
        services.Configure<KeycloakSettings>(configuration.GetSection("KeyCloak"));

        // Register KeycloakService and its dependencies
        services.AddScoped<IKeycloakService, KeycloakService>();
        services.AddHttpClient("KeycloakClient", client =>
        {
            var keycloakUrl = configuration["KeyCloak:Url"];
            client.BaseAddress = new Uri(keycloakUrl!);
        });

        services.AddSignalR();
    }
}