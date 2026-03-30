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

if (mode == "exec")
{
    if (args.Length < 2)
    {
        Console.WriteLine("Usage: exec <sql>");
        return 1;
    }
    var sql = string.Join(" ", args.Skip(1));
    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);
    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();
    await using var cmd = context.Database.GetDbConnection().CreateCommand();
    cmd.CommandText = sql;
    cmd.CommandTimeout = 30;
    await cmd.ExecuteNonQueryAsync();
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("SQL executed successfully!");
    Console.ResetColor();
    return 0;
}

if (mode == "query")
{
    if (args.Length < 2)
    {
        Console.WriteLine("Usage: query <sql>");
        return 1;
    }
    var sql = string.Join(" ", args.Skip(1));
    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);
    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();
    await using var cmd = context.Database.GetDbConnection().CreateCommand();
    cmd.CommandText = sql;
    var reader = await cmd.ExecuteReaderAsync();
    var cols = Enumerable.Range(0, reader.FieldCount).Select(i => reader.GetName(i)).ToList();
    Console.WriteLine(string.Join(" | ", cols));
    while (await reader.ReadAsync())
    {
        var vals = Enumerable.Range(0, reader.FieldCount).Select(i => reader.IsDBNull(i) ? "NULL" : reader.GetValue(i).ToString()!).ToList();
        Console.WriteLine(string.Join(" | ", vals));
    }
    Console.ResetColor();
    return 0;
}

if (mode == "verify")
{
    await VerifyAsync(connectionString);
    return 0;
}

if (mode == "check")
{
    await CheckSchemaAsync(connectionString);
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

// Default: migrate only
EnsureDatabase.For.PostgresqlDatabase(connectionString);
Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Database ensured/created!");

// Apply EF migrations
var migratorOptionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
migratorOptionsBuilder.UseNpgsql(connectionString);
await using var migratorContext = new AppDbContext(migratorOptionsBuilder.Options);
await migratorContext.Database.MigrateAsync();
Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("EF migrations applied successfully!");
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

static async Task CheckSchemaAsync(string connectionString)
{
    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseNpgsql(connectionString);
    await using var context = new AppDbContext(optionsBuilder.Options);
    await context.Database.OpenConnectionAsync();

    var tables = new[] {
        "TourPlanLocations", "TourDays", "TourInstances", "TourClassifications", "Tours"
    };

    foreach (var table in tables)
    {
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        cmd.CommandText = $"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}' ORDER BY ordinal_position";
        var cols = new List<string>();
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync()) cols.Add(reader.GetString(0));
        Console.WriteLine($"{table}: {string.Join(", ", cols)}");
    }

    Console.WriteLine("\n__EFMigrationsHistory:");
    await using var cmd2 = context.Database.GetDbConnection().CreateCommand();
    cmd2.CommandText = "SELECT \"MigrationId\" FROM \"__EFMigrationsHistory\" ORDER BY \"MigrationId\"";
    await using var reader2 = await cmd2.ExecuteReaderAsync();
    while (await reader2.ReadAsync()) Console.WriteLine($"  {reader2.GetString(0)}");

    Console.WriteLine("\nExisting Tours:");
    await using var cmd3 = context.Database.GetDbConnection().CreateCommand();
    cmd3.CommandText = "SELECT \"Id\", \"TourCode\" FROM \"Tours\" LIMIT 5";
    await using var reader3 = await cmd3.ExecuteReaderAsync();
    while (await reader3.ReadAsync()) Console.WriteLine($"  {reader3.GetGuid(0)} | {reader3.GetString(1)}");

    Console.WriteLine("\nTourPlanLocations:");
    await using var cmd4 = context.Database.GetDbConnection().CreateCommand();
    cmd4.CommandText = "SELECT \"Id\", \"TourId\", \"TourDayActivityId\", \"TourEntityId\" FROM \"TourPlanLocations\" LIMIT 5";
    await using var reader4 = await cmd4.ExecuteReaderAsync();
    while (await reader4.ReadAsync())
    {
        var tid = reader4.IsDBNull(1) ? "NULL" : reader4.GetGuid(1).ToString();
        var aid = reader4.IsDBNull(2) ? "NULL" : reader4.GetGuid(2).ToString();
        var eid = reader4.IsDBNull(3) ? "NULL" : reader4.GetGuid(3).ToString();
        Console.WriteLine($"  {reader4.GetGuid(0)} | TourId={tid} | ActivityId={aid} | EntityId={eid}");
    }
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
