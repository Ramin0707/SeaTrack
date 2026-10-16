using Domain.Enums;

namespace Application.Features.Shipping.Customer.Payment.GetMy.DTOs;

public class GetMyPaymentResponseDto
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public int ShippingOrderId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = string.Empty;

    public PaymentStatus Status { get; set; }

    public string? TransactionReference { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? PaidAtUtc { get; set; }
}