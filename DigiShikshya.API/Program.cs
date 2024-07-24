using System.Data;
using DbUp;
using Npgsql;


var builder = WebApplication.CreateBuilder(args);

// --------------------
// Configuration Section
// --------------------
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("PostgreSQL");

// Register NpgsqlConnection as a scoped service
builder.Services.AddScoped<IDbConnection>(x => new NpgsqlConnection(connectionString));

// --------------------
// Database Migration Section
// --------------------
EnsureDatabase.For.PostgresqlDatabase(connectionString);

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

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();

