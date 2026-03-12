using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class FileMetadataContextSeed
{
    public static void SeedData(DbSet<FileMetadataEntity> filemetadataCollection)
    {
        if (filemetadataCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<FileMetadataEntity>("file-metadata.json");

        if (items is { Count: > 0 })
        {
            filemetadataCollection.AddRange(items);
        }
    }
}
