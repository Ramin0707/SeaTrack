namespace Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.DTOs;

public class GetQuoteByShippingOrderIdResponseDto
{
    public int Id { get; set; }

    public int ShippingOrderId { get; set; }

    public decimal Price { get; set; }

    public string Currency { get; set; } = string.Empty;

    public int EstimatedTransitDays { get; set; }

    public DateTime ValidUntil { get; set; }

    public string? Notes { get; set; }
}