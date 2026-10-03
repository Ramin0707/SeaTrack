namespace Domain.Entities;

public class Quote : BaseEntity
{
    public int ShippingOrderId { get; set; }

    public decimal Price { get; set; }

    public string Currency { get; set; } = "USD";

    public int EstimatedTransitDays { get; set; }

    public DateTime ValidUntil { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ShippingOrder ShippingOrder { get; set; } = null!;
}