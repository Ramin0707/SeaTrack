namespace Application.Features.Shipping.LogisticsAdmin.Quote.GetAll.DTOs;

public class GetAllQuotesResponseDto
{
    public int Id { get; set; }

    public int ShippingOrderId { get; set; }

    public string CustomerId { get; set; } = string.Empty;

    public string CargoType { get; set; } = string.Empty;

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Currency { get; set; } = string.Empty;

    public int EstimatedTransitDays { get; set; }

    public DateTime ValidUntil { get; set; }

    public string? Notes { get; set; }

    public int ShippingOrderStatus { get; set; }
}