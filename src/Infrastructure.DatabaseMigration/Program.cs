using DbUp;
using System.Reflection;

var connectionString =
    Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    ?? throw new Exception("No DB_CONNECTION_STRING environment variable");

Console.WriteLine($"Connection string: {connectionString}");

EnsureDatabase.For.MySqlDatabase(connectionString, "utf8mb4_unicode_ci");

var upgrader =
    DeployChanges.To
        .MySqlDatabase(connectionString)
        .WithVariablesDisabled()
        .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
        .LogToConsole()
        .Build();

var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(result.Error);
    Console.ResetColor();
#if DEBUG
    Console.ReadLine();
#endif
    return -1;
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Success!");
Console.ResetColor();
return 0;

