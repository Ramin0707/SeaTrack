using Application.Features.Shipping.Customer.Quote.Accept.DTOs;

namespace Application.Features.Shipping.Customer.Quote.Accept.Interfaces;

public interface IAcceptQuoteHandler
{
    Task<AcceptQuoteResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId);
}