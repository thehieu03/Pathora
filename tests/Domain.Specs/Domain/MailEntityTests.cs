using Domain.Mails;

namespace Domain.Specs.Domain;

public sealed class MailEntityTests
{
    [Fact]
    public void Timestamp_PropertyTypes_ShouldUseDateTimeOffset()
    {
        var sentAtProperty = typeof(MailEntity).GetProperty(nameof(MailEntity.SentAt));
        var createdAtProperty = typeof(MailEntity).GetProperty(nameof(MailEntity.CreatedAt));

        Assert.NotNull(sentAtProperty);
        Assert.NotNull(createdAtProperty);
        Assert.Equal(typeof(DateTimeOffset?), sentAtProperty!.PropertyType);
        Assert.Equal(typeof(DateTimeOffset), createdAtProperty!.PropertyType);
    }
}
