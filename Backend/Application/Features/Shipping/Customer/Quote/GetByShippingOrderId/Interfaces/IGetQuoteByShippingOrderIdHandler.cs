using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.DTOs;

namespace Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.Interfaces;

public interface IGetQuoteByShippingOrderIdHandler
{
    Task<GetQuoteByShippingOrderIdResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId);
}