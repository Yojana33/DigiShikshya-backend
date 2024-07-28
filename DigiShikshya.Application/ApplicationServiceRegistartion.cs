using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

public static class ApplicationServiceRegistartion
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        //Register database connection
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));


    }
}