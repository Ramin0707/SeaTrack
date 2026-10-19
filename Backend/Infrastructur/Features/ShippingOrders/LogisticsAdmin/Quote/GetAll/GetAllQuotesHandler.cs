using Application.Features.Shipping.LogisticsAdmin.Quote.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Quote.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Quote.GetAll;

public class GetAllQuotesHandler : IGetAllQuotesHandler
{
    private readonly AppDbContext _dbContext;

    public GetAllQuotesHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetAllQuotesResponseDto>> HandleAsync()
    {
        return await _dbContext.Quotes
            .AsNoTracking()
            .OrderByDescending(quote => quote.Id)
            .Select(quote => new GetAllQuotesResponseDto
            {
                Id = quote.Id,

                ShippingOrderId = quote.ShippingOrderId,

                CustomerId = quote.ShippingOrder.CustomerId,

                CargoType = quote.ShippingOrder.CargoType,

                OriginPort = quote.ShippingOrder.OriginPort,

                DestinationPort = quote.ShippingOrder.DestinationPort,

                Price = quote.Price,

                Currency = quote.Currency,

                EstimatedTransitDays =
                    quote.EstimatedTransitDays,

                ValidUntil = quote.ValidUntil,

                Notes = quote.Notes,

                ShippingOrderStatus =
                    (int)quote.ShippingOrder.Status
            })
            .ToListAsync();
    }
}