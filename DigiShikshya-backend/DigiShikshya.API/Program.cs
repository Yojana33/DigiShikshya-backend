using System.Security.Claims;
using DbUp;
using DigiShikshya.Infrastructure.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("PostgreSQL");

if (string.IsNullOrEmpty(connectionString))
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("Connection string for PostgreSQL is missing!");
    Console.ResetColor();
    Environment.Exit(1);
}

// Service Registration
builder.Services.AddControllers();

// Remove incorrect registrations
// builder.Services.AddScoped<IHttpContextAccessor>();
// builder.Services.AddScoped<IHttpContextAccessor, HttpContextAccessor>();

// Correctly register IHttpContextAccessor
builder.Services.AddHttpContextAccessor();

builder.Services.AddInfrastructureServices(configuration);
builder.Services.AddPersistenceServices(connectionString);
builder.Services.AddApplicationServices();

// Authentication Configuration (Keycloak)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://keycloak:8080/realms/digishikshya";
        options.Audience = "account"; 
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "http://keycloak:8080/realms/digishikshya",
            ValidateAudience = true,
            ValidAudience = "account",
            // ValidateLifetime = true,  // uncomment when ready to check token expiration
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                if (context.Principal!.Identity is ClaimsIdentity claimsIdentity)
                {
                    var realmAccess = context.Principal.FindFirst("realm_access")?.Value;
                    var resourceAccess = context.Principal.FindFirst("resource_access")?.Value;

                    if (realmAccess != null)
                    {
                        var roles = System.Text.Json.JsonDocument.Parse(realmAccess)
                            .RootElement.GetProperty("roles")
                            .EnumerateArray()
                            .Select(role => new Claim(ClaimTypes.Role, role.GetString()!));
                        claimsIdentity.AddClaims(roles);
                    }

                    if (resourceAccess != null)
                    {
                        var resourceRoles = System.Text.Json.JsonDocument.Parse(resourceAccess)
                            .RootElement
                            .EnumerateObject()
                            .SelectMany(prop => prop.Value.GetProperty("roles").EnumerateArray())
                            .Select(role => new Claim(ClaimTypes.Role, role.GetString()!));
                        claimsIdentity.AddClaims(resourceRoles);
                    }
                }

                // Optional: Add user-specific data to HttpContext
                var userId = context.Principal!.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                context.HttpContext.Items["UserId"] = userId;
                context.HttpContext.Items["Name"] = context.Principal!.FindFirst(ClaimTypes.Name)?.Value;

                return Task.CompletedTask;
            }
        };
    });

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DigiShikshya.API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Database Migration (DbUp)
var upgrader = DeployChanges.To.PostgresqlDatabase(connectionString)
    .WithScriptsFromFileSystem("/app/Migration")
    .LogToConsole()
    .Build();

var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(result.Error);
    Console.ResetColor();
    Environment.Exit(1);
}
else
{
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("Database migration successful!");
    Console.ResetColor();
}

// Application Setup
var app = builder.Build();

// Configure HttpContextHelper
var httpContextAccessor = app.Services.GetRequiredService<IHttpContextAccessor>();
HttpContextHelper.Configure(httpContextAccessor);

app.UseCors("AllowFrontend");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DigiShikshya API v1");
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    c.DefaultModelsExpandDepth(-1);
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<VideoHub>("/videohub");

app.Run();
