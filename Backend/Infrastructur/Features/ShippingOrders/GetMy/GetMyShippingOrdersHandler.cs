using Application.Features.ShippingOrders.GetMy.DTOs;
using Application.Features.ShippingOrders.GetMy.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.GetMy;

public class GetMyShippingOrdersHandler : IGetMyShippingOrdersHandler
{
    private readonly AppDbContext _dbContext;

    public GetMyShippingOrdersHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetMyShippingOrderResponseDto>> HandleAsync(
        string customerId)
    {
        return await _dbContext.ShippingOrders
            .AsNoTracking()
            .Where(order => order.CustomerId == customerId)
            .OrderByDescending(order => order.CreatedAtUtc)
            .Select(order => new GetMyShippingOrderResponseDto
            {
                Id = order.Id,
                CargoType = order.CargoType,
                Weight = order.Weight,
                Volume = order.Volume,
                OriginPort = order.OriginPort,
                DestinationPort = order.DestinationPort,
                ContainerType = order.ContainerType,
                DesiredShippingDate = order.DesiredShippingDate,
                Status = order.Status,
                CreatedAtUtc = order.CreatedAtUtc
            })
            .ToListAsync();
    }
}