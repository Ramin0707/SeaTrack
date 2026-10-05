using Domain.Enums;

namespace Domain.Entities;

public class Payment : BaseEntity
{
    public int InvoiceId { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "USD";

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public string? TransactionReference { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? PaidAtUtc { get; set; }

    public Invoice Invoice { get; set; } = null!;
}