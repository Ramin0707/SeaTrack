using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.DTOs;
using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Quote.GetByShippingOrderId;

public class GetQuoteByShippingOrderIdHandler
    : IGetQuoteByShippingOrderIdHandler
{
    private readonly AppDbContext _context;

    public GetQuoteByShippingOrderIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetQuoteByShippingOrderIdResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId)
    {
        var quote = await _context.Quotes
            .AsNoTracking()
            .Where(q =>
                q.ShippingOrderId == shippingOrderId &&
                q.ShippingOrder.CustomerId == customerId)
            .Select(q => new GetQuoteByShippingOrderIdResponseDto
            {
                Id = q.Id,
                ShippingOrderId = q.ShippingOrderId,
                Price = q.Price,
                Currency = q.Currency,
                EstimatedTransitDays = q.EstimatedTransitDays,
                ValidUntil = q.ValidUntil,
                Notes = q.Notes
            })
            .FirstOrDefaultAsync();

        return quote;
    }
}