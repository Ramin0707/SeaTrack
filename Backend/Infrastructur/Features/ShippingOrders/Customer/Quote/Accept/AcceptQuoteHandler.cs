using Application.Features.Shipping.Customer.Quote.Accept.DTOs;
using Application.Features.Shipping.Customer.Quote.Accept.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Quote.Accept;

public class AcceptQuoteHandler : IAcceptQuoteHandler
{
    private readonly AppDbContext _dbContext;

    public AcceptQuoteHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AcceptQuoteResponseDto?> HandleAsync(
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

        shippingOrder.Status = ShippingOrderStatus.QuoteAccepted;

        await _dbContext.SaveChangesAsync();
        return new AcceptQuoteResponseDto
        {
            QuoteId = quote.Id,
            ShippingOrderId = shippingOrder.Id,
            Price = quote.Price,
            Currency = quote.Currency,
            ShippingOrderStatus = shippingOrder.Status
        };
    }
}