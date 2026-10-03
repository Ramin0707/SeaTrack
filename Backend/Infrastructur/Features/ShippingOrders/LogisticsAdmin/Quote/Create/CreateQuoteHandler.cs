using Application.Features.Shipping.LogisticsAdmin.Quote.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Quote.Create;

public class CreateQuoteHandler : ICreateQuoteHandler
{
    private readonly AppDbContext _dbContext;

    public CreateQuoteHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateQuoteResponseDto?> HandleAsync(
        int shippingOrderId,
        CreateQuoteRequestDto request)
    {
        var shippingOrder = await _dbContext.ShippingOrders
            .FirstOrDefaultAsync(order => order.Id == shippingOrderId);

        if (shippingOrder is null)
        {
            return null;
        }

        if (shippingOrder.Status != ShippingOrderStatus.AwaitingQuote)
        {
            return null;
        }

        var quoteAlreadyExists = await _dbContext.Quotes
            .AnyAsync(quote => quote.ShippingOrderId == shippingOrderId);

        if (quoteAlreadyExists)
        {
            return null;
        }

        var quote = new Domain.Entities.Quote
        {
            ShippingOrderId = shippingOrderId,
            Price = request.Price,
            Currency = request.Currency ?? "USD",
            EstimatedTransitDays = request.EstimatedTransitDays,
            ValidUntil = request.ValidUntil,
            Notes = request.Notes
        };

        _dbContext.Quotes.Add(quote);

        shippingOrder.Status = ShippingOrderStatus.QuoteProvided;

        await _dbContext.SaveChangesAsync();

        return new CreateQuoteResponseDto
        {
            Id = quote.Id,
            ShippingOrderId = quote.ShippingOrderId,
            Price = quote.Price,
            Currency = quote.Currency,
            EstimatedTransitDays = quote.EstimatedTransitDays,
            ValidUntil = quote.ValidUntil,
            Notes = quote.Notes,
            CreatedAtUtc = quote.CreatedAtUtc
        };
    }
}