using Domain.Enums;

namespace Application.Features.Shipping.Customer.Quote.Accept.DTOs;

public class AcceptQuoteResponseDto
{
    public int QuoteId { get; set; }

    public int ShippingOrderId { get; set; }

    public decimal Price { get; set; }

    public string Currency { get; set; } = string.Empty;

    public ShippingOrderStatus ShippingOrderStatus { get; set; }
}