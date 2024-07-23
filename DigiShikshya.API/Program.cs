using DbUp;

var builder = WebApplication.CreateBuilder(args);

// Configuration section
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("PostgreSQL");

// Database migration section
EnsureDatabase.For.PostgresqlDatabase(connectionString);

var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString) // Specify the connection string for the PostgreSQL database
    .WithScriptsFromFileSystem("../DigiShikshya.Persistence/Migration") // Specify the folder containing the migration scripts
    .LogToConsole() // Log the migration progress to the console
    .Build(); // Build the upgrader object

var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(result.Error);
    Console.ResetColor();
    Environment.Exit(1); // Exit the application if the migration fails
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Success!");
Console.ResetColor();

// Application setup section
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();

