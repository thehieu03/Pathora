using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourDayContextSeed
{
    public static void SeedData(AppDbContext context)
    {
        if (context.TourDays.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourDaySeedModel>("tour-day.json");

        if (items is not { Count: > 0 })
        {
            return;
        }

        var classifications = context.TourClassifications.Local.Count > 0
            ? context.TourClassifications.Local.ToList()
            : context.TourClassifications.AsNoTracking().ToList();

        var classificationIdByTourId = classifications
            .OrderBy(classification => classification.AdultPrice)
            .ThenBy(classification => classification.Id)
            .GroupBy(classification => classification.TourId)
            .ToDictionary(group => group.Key, group => group.First().Id);

        var entities = new List<TourDayEntity>(items.Count);

        foreach (var item in items)
        {
            if (!classificationIdByTourId.TryGetValue(item.TourId, out var classificationId))
            {
                throw new InvalidOperationException(
                    $"Could not map tour-day seed '{item.Id}' because tour '{item.TourId}' has no classification seed.");
            }

            entities.Add(new TourDayEntity
            {
                Id = item.Id,
                ClassificationId = classificationId,
                DayNumber = item.DayNumber,
                Title = item.Title,
                Description = item.Description,
                CreatedBy = item.CreatedBy,
                CreatedOnUtc = item.CreatedOnUtc,
                LastModifiedBy = item.LastModifiedBy,
                LastModifiedOnUtc = item.LastModifiedOnUtc
            });
        }

        context.TourDays.AddRange(entities);
    }

    private sealed class TourDaySeedModel
    {
        public Guid Id { get; set; }
        public Guid TourId { get; set; }
        public int DayNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? CreatedBy { get; set; }
        public DateTimeOffset CreatedOnUtc { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTimeOffset? LastModifiedOnUtc { get; set; }
    }
}
