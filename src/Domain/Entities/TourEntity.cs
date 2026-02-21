namespace Domain.Entities;

public class TourEntity: Aggregate<Guid>
{
    public string TourCode { get; set; } = null!;
    public string TourName { get; set; } = null!;
    public string ShortDescription { get; set; }=null!;
    public string LongDescription { get; set; }=null!;
    public decimal Price { get; set; }  
    public decimal SalePrice { get; set; }
}
