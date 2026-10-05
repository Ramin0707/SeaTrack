using Domain.Enums;

namespace Application.Features.Shipping.Customer.Quote.Reject.DTOs;

public class RejectQuoteResponseDto
{
    public int QuoteId { get; set; }

    public int ShippingOrderId { get; set; }

    public ShippingOrderStatus ShippingOrderStatus { get; set; }
}