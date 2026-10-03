using Application.Features.Shipping.LogisticsAdmin.Quote.Create.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Quote.Create.Interfaces;

public interface ICreateQuoteHandler
{
    Task<CreateQuoteResponseDto?> HandleAsync(
        int shippingOrderId,
        CreateQuoteRequestDto request);
}