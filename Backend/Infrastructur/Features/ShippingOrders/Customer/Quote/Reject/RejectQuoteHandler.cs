using Application.Features.Shipping.Customer.Quote.Reject.DTOs;
using Application.Features.Shipping.Customer.Quote.Reject.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Quote.Reject;

public class RejectQuoteHandler : IRejectQuoteHandler
{
    private readonly AppDbContext _dbContext;

    public RejectQuoteHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RejectQuoteResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId)
    {
        var shippingOrder = await _dbContext.ShippingOrders
            .FirstOrDefaultAsync(x =>
                x.Id == shippingOrderId &&
                x.CustomerId == customerId);

        if (shippingOrder is null)
        {
            return null;
        }

        if (shippingOrder.Status != ShippingOrderStatus.QuoteProvided)
        {
            return null;
        }

        var quote = await _dbContext.Quotes
            .FirstOrDefaultAsync(x =>
                x.ShippingOrderId == shippingOrderId);

        if (quote is null)
        {
            return null;
        }

        shippingOrder.Status = ShippingOrderStatus.QuoteRejected;

        await _dbContext.SaveChangesAsync();

        return new RejectQuoteResponseDto
        {
            QuoteId = quote.Id,
            ShippingOrderId = shippingOrder.Id,
            ShippingOrderStatus = shippingOrder.Status
        };
    }
}