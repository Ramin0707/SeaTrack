using Domain.Enums;

namespace Application.Features.Shipping.Customer.Invoice.GetByOrderId.DTOs;

public class GetInvoiceByOrderIdResponseDto
{
    public int Id { get; set; }

    public int ShippingOrderId { get; set; }

    public int QuoteId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = string.Empty;

    public InvoiceStatus Status { get; set; }

    public DateTime IssuedAtUtc { get; set; }

    public DateTime DueDateUtc { get; set; }
}