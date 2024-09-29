using System.Security.Claims;
using DbUp;
using DigiShikshya.Infrastructure.Hubs;
using DigiShikshya.Infrastructure.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Configuration Section
// --------------------
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("PostgreSQL");

// Check if connection string is not null or empty
if (string.IsNullOrEmpty(connectionString))
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("Connection string for PostgreSQL is missing!");
    Console.ResetColor();
    Environment.Exit(1);
}

// --------------------
// Service Registration Section
// --------------------
builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:8080/auth/realms/digishikshya";
        options.Audience = "digishiksya-backend";
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "http://localhost:8080/auth/realms/digishikshya",
            ValidateAudience = true,
            ValidAudience = "digishiksya-backend",
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                if (context.Principal?.Identity is ClaimsIdentity claimsIdentity)
                {
                    var resourceAccess = context.Principal.FindFirst("resource_access")?.Value;

                    if (resourceAccess != null)
                    {
                        var resourceRoles = Newtonsoft.Json.Linq.JObject.Parse(resourceAccess)
                            .SelectTokens("$.digishiksya-backend.roles")
                            .SelectMany(roles => roles)
                            .Select(role => new Claim(ClaimTypes.Role, role.ToString()));

                        claimsIdentity.AddClaims(resourceRoles);
                    }
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("TeacherPolicy", policy => policy.RequireRole("Teacher"));
    options.AddPolicy("StudentPolicy", policy => policy.RequireRole("Student"));
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "DigiShikshya.API", Version = "v1" });
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(connectionString!);
builder.Services.AddInfrastructureServices();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// --------------------
// Database Migration Section
// --------------------
// Ensure the database exists
var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString) // Connection string for the PostgreSQL database
    .WithScriptsFromFileSystem("/app/Migration") // Adjust the path to match the Docker container structure
    .LogToConsole() // Log migration progress to console
    .Build(); // Build the upgrader object

var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(result.Error);
    Console.ResetColor();
    Environment.Exit(1); // Exit if migration fails
}
else
{
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("Database migration successful!");
    Console.ResetColor();
}

// --------------------
// Application Setup Section
// --------------------
var app = builder.Build();

// --------------------
// Middleware Configuration Section
// --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DigiShikshya API v1");
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
        c.DocumentTitle = "DigiShikshya API";
        c.RoutePrefix = string.Empty;

        // Additional customizations
        c.DefaultModelsExpandDepth(-1); // Hide models section
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();

// --------------------
// Endpoint Mapping Section
// --------------------
app.MapControllers();
app.MapHub<VideoHub>("/videohub");

app.UseLoggingMiddleware();

// --------------------
// Run the Application
// --------------------
app.Run();
