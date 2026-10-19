namespace Application.Features.Shipping.LogisticsAdmin.Invoice.GetAll.DTOs;

public class GetAllInvoicesResponseDto
{
    public int Id { get; set; }

    public int ShippingOrderId { get; set; }

    public int QuoteId { get; set; }

    public string CustomerId { get; set; } = string.Empty;

    public string CargoType { get; set; } = string.Empty;

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = string.Empty;

    public int Status { get; set; }

    public DateTime IssuedAtUtc { get; set; }

    public DateTime DueDateUtc { get; set; }

    public int ShippingOrderStatus { get; set; }
}