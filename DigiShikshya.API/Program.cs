using DbUp;
using DigiShikshya.Infrastructure.Middleware;


var builder = WebApplication.CreateBuilder(args);

// --------------------
// Configuration Section
// --------------------
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("PostgreSQL");

// --------------------
// Service Registration Section
// --------------------
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "DigiShikshya.API", Version = "v1" });
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(connectionString!);

builder.Logging.ClearProviders();

builder.Logging.AddConsole();
// --------------------
// Database Migration Section
// --------------------
// Ensure the database exists
var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString) // Connection string for the PostgreSQL database
    .WithScriptsFromFileSystem("../DigiShikshya.Persistence/Migration") // Folder with migration scripts
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
        c.DefaultModelExpandDepth(1); // Set default expansion depth for models
        c.DisplayRequestDuration(); // Display request duration
        c.EnableDeepLinking(); // Enable deep linking
        c.ShowExtensions(); // Show vendor extensions (x-*)
        c.EnableFilter(); // Enable filtering by tag
        c.ShowCommonExtensions(); // Show common extensions
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();

// --------------------
// Endpoint Mapping Section
// --------------------
app.MapControllers();
app.UseLoggingMiddleware();
// --------------------
// Run the Application
// --------------------
app.Run();
