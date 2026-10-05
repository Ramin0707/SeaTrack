using Domain.Enums;

namespace Domain.Entities;

public class Invoice : BaseEntity
{
    public int ShippingOrderId { get; set; }

    public int QuoteId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "USD";

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Pending;

    public DateTime IssuedAtUtc { get; set; }

    public DateTime DueDateUtc { get; set; }

    public DateTime? PaidAtUtc { get; set; }

    public ShippingOrder ShippingOrder { get; set; } = null!;

    public Quote Quote { get; set; } = null!;
}