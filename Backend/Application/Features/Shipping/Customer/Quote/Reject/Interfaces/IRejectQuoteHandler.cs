using Application.Features.Shipping.Customer.Quote.Reject.DTOs;

namespace Application.Features.Shipping.Customer.Quote.Reject.Interfaces;

public interface IRejectQuoteHandler
{
    Task<RejectQuoteResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId);
}