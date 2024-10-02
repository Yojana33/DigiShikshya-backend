using System.Security.Claims;
using DbUp;
using DigiShikshya.Infrastructure.Hubs;
using DigiShikshya.Infrastructure.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

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

// Authentication Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://keycloak:8080/realms/digishikshya";
        options.Audience = "account"; // Update this to match the token's `aud` claim
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "http://keycloak:8080/realms/digishikshya",
            ValidateAudience = true,
            ValidAudience = "account", // Update this to match the token's `aud` claim
            ValidateLifetime = true,
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
                Console.WriteLine("Token validated: " + context.SecurityToken);
                if (context.Principal?.Identity is ClaimsIdentity claimsIdentity)
                {
                    var realmAccess = context.Principal.FindFirst("realm_access")?.Value;
                    var resourceAccess = context.Principal.FindFirst("resource_access")?.Value;

                    if (realmAccess != null)
                    {
                        var realmRoles = System.Text.Json.JsonDocument.Parse(realmAccess)
                            .RootElement.GetProperty("roles")
                            .EnumerateArray()
                            .Select(role => new Claim(ClaimTypes.Role, role.GetString()));
                        claimsIdentity.AddClaims(realmRoles);
                    }

                    if (resourceAccess != null)
                    {
                        var resourceRoles = System.Text.Json.JsonDocument.Parse(resourceAccess)
                            .RootElement
                            .EnumerateObject()
                            .SelectMany(prop => prop.Value.GetProperty("roles").EnumerateArray())
                            .Select(role => new Claim(ClaimTypes.Role, role.GetString()));
                        claimsIdentity.AddClaims(resourceRoles);
                    }
                }

                return Task.CompletedTask;
            }
        };
    });

// Authorization Configuration
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("TeacherPolicy", policy => policy.RequireRole("Teacher"));
    options.AddPolicy("StudentPolicy", policy => policy.RequireRole("Student"));
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
                Reference = new OpenApiReference 
                { 
                    Type = ReferenceType.SecurityScheme, 
                    Id = "Bearer" 
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
                builder =>
                {
                    builder.WithOrigins("http://localhost:3000")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
});

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(connectionString!);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug(); // Enable detailed logging

// --------------------
// Database Migration Section
// --------------------
var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString)
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

// --------------------
// Application Setup Section
// --------------------
var app = builder.Build();


app.UseCors("AllowFrontend");

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
app.UseAuthentication(); // Ensure authentication middleware is added
app.UseAuthorization();

// Optional: Middleware to check token expiration
app.Use(async (context, next) =>
{
    if (context.User.Identity.IsAuthenticated)
    {
        var expClaim = context.User.FindFirst("exp")?.Value;
        if (expClaim != null && long.TryParse(expClaim, out var exp))
        {
            var expirationTime = DateTimeOffset.FromUnixTimeSeconds(exp);
            if (expirationTime < DateTimeOffset.UtcNow)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token has expired.");
                return;
            }
        }
    }

    await next();
});

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
