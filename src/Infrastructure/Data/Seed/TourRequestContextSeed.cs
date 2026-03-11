using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourRequestContextSeed
{
    public static void SeedData(AppDbContext context)
    {
        if (context.TourRequests.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourRequestSeedModel>("tour-request.json");

        if (items is { Count: > 0 })
        {
            var userIds = context.Users
                .AsNoTracking()
                .Select(user => user.Id)
                .ToHashSet();

            var tourInstanceIds = context.TourInstances
                .AsNoTracking()
                .Select(instance => instance.Id)
                .ToHashSet();

            var mappedItems = items.Select(item => new TourRequestEntity
            {
                Id = item.Id,
                UserId = item.UserId is { } userId && userIds.Contains(userId) ? userId : null,
                CustomerName = item.CustomerName,
                CustomerPhone = item.CustomerPhone,
                CustomerEmail = item.CustomerEmail,
                Destination = item.Destination,
                DepartureDate = item.DepartureDate,
                ReturnDate = item.ReturnDate,
                NumberAdult = item.NumberAdult,
                NumberChild = item.NumberChild,
                NumberInfant = item.NumberInfant,
                Budget = item.Budget,
                SpecialRequirements = item.SpecialRequirements,
                Note = item.Note,
                Status = item.Status,
                AdminNote = item.AdminNote,
                ReviewedBy = item.ReviewedBy is { } reviewedBy && userIds.Contains(reviewedBy) ? reviewedBy : null,
                ReviewedAt = item.ReviewedAt,
                TourInstanceId = item.TourInstanceId is { } tourInstanceId && tourInstanceIds.Contains(tourInstanceId)
                    ? tourInstanceId
                    : null,
                CreatedBy = item.CreatedBy,
                CreatedOnUtc = item.CreatedOnUtc,
                LastModifiedBy = item.LastModifiedBy,
                LastModifiedOnUtc = item.LastModifiedOnUtc
            }).ToList();

            context.TourRequests.AddRange(mappedItems);
        }
    }

    private sealed class TourRequestSeedModel
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
        public string Destination { get; set; } = string.Empty;
        public DateTimeOffset DepartureDate { get; set; }
        public DateTimeOffset? ReturnDate { get; set; }
        public int NumberAdult { get; set; }
        public int NumberChild { get; set; }
        public int NumberInfant { get; set; }
        public decimal? Budget { get; set; }
        public string? SpecialRequirements { get; set; }
        public string? Note { get; set; }
        public TourRequestStatus Status { get; set; }
        public string? AdminNote { get; set; }
        public Guid? ReviewedBy { get; set; }
        public DateTimeOffset? ReviewedAt { get; set; }
        public Guid? TourInstanceId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTimeOffset CreatedOnUtc { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTimeOffset? LastModifiedOnUtc { get; set; }
    }
}
