using Domain.Enums;

namespace Application.Features.Shipping.Customer.Payment.Pay.DTOs;

public class PayInvoiceResponseDto
{
    public int PaymentId { get; set; }

    public int InvoiceId { get; set; }

    public int ShippingOrderId { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = string.Empty;

    public PaymentStatus PaymentStatus { get; set; }

    public InvoiceStatus InvoiceStatus { get; set; }

    public ShippingOrderStatus ShippingOrderStatus { get; set; }

    public string TransactionReference { get; set; } = string.Empty;

    public DateTime PaidAtUtc { get; set; }
}