using System.Data.Common;
using DbUp;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Infrastructure.Data.Seed;

var mode = args.Length > 0 ? args[0].ToLowerInvariant() : "migrate";

var connectionString =
    Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    ?? throw new Exception("No DB_CONNECTION_STRING environment variable");

Console.WriteLine($"Connection string: {connectionString}");
Console.WriteLine($"Mode: {mode}");

if (mode == "seed")
{
    await SeedAsync(connectionString);
    return 0;
}

if (mode == "updatepasswords")
{
    await UpdatePasswordsAsync(connectionString, args.Length > 1 ? args[1] : "thehieu03");
    return 0;
}

if (mode == "verify")
{
    await VerifyAsync(connectionString);
    return 0;
}

if (mode == "sql")
{
    if (args.Length < 2)
    {
        Console.WriteLine("Usage: sql <sqlFilePath>");
        return 1;
    }
    await ExecuteSqlFileAsync(connectionString, args[1]);
    return 0;
}

if (mode == "both")
{
    // Ensure database exists (via DbUp's EnsureDatabase - creates if not exists)
    EnsureDatabase.For.PostgresqlDatabase(connectionString);
    Console.WriteLine("Database ensured/created.");

    // Then seed
    await SeedAsync(connectionString);
    return 0;
}

// Default: migrate only (just ensure DB exists)
EnsureDatabase.For.PostgresqlDatabase(connectionString);
Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Database ensured/created!");
Console.ResetColor();
return 0;

static async Task UpdatePasswordsAsync(string connectionString, string newPassword)
{
    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);
    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();

    var users = context.Users.ToList();
    foreach (var user in users)
    {
        user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.ForcePasswordChange = false;
    }
    context.SaveChanges();

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine($"Updated password for {users.Count} users to: {newPassword}");
    Console.ResetColor();
}

static async Task VerifyAsync(string connectionString)
{
    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);
    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();

    var tables = new[] {
        "Users", "Roles", "UserRoles",
        "Tours", "TourClassifications", "TourDays", "TourDayActivities",
        "TourPlanLocations", "TourPlanRoutes", "TourPlanAccommodations",
        "TourInsurances", "TourResources", "TourImages"
    };

    foreach (var table in tables)
    {
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        cmd.CommandText = $"SELECT COUNT(*) FROM \"{table}\"";
        var count = (long)(await cmd.ExecuteScalarAsync() ?? 0);
        Console.WriteLine($"{table}: {count}");
    }
}

static async Task ExecuteSqlFileAsync(string connectionString, string filePath)
{
    Console.WriteLine($"Executing SQL file: {filePath}");

    if (!File.Exists(filePath))
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"File not found: {filePath}");
        Console.ResetColor();
        return;
    }

    var sql = await File.ReadAllTextAsync(filePath);

    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);
    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();

    await using var cmd = context.Database.GetDbConnection().CreateCommand();
    cmd.CommandText = sql;
    cmd.CommandTimeout = 300;
    try
    {
        await cmd.ExecuteNonQueryAsync();
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("SQL file executed successfully!");
    }
    catch (Exception ex)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"SQL Error: {ex.Message}");
        Console.ResetColor();
        throw;
    }
    Console.ResetColor();
}

static async Task SeedAsync(string connectionString)
{
    Console.WriteLine("Starting User/Role seed...");

    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);

    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();

    var seeded = UserRoleSeed.SeedData(context);

    if (seeded)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("User/Role seed completed successfully!");
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("User/Role data already exists, skipping seed.");
    }
    Console.ResetColor();
}
