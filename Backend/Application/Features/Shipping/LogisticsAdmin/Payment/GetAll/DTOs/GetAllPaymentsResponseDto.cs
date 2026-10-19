namespace Application.Features.Shipping.LogisticsAdmin.Payment.GetAll.DTOs;

public class GetAllPaymentsResponseDto
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public int ShippingOrderId { get; set; }

    public string CustomerId { get; set; } = string.Empty;

    public string InvoiceNumber { get; set; } = string.Empty;

    public string CargoType { get; set; } = string.Empty;

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = string.Empty;

    public int Status { get; set; }

    public string? TransactionReference { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? PaidAtUtc { get; set; }

    public int InvoiceStatus { get; set; }

    public int ShippingOrderStatus { get; set; }
}