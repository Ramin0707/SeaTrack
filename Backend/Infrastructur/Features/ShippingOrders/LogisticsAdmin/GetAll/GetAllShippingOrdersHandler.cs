using Application.Features.Shipping.LogisticsAdmin.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.GetAll;

public class GetAllShippingOrdersHandler : IGetAllShippingOrdersHandler
{
    private readonly AppDbContext _dbContext;

    public GetAllShippingOrdersHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetAllShippingOrderResponseDto>> HandleAsync()
    {
        return await _dbContext.ShippingOrders
            .AsNoTracking()
            .OrderByDescending(order => order.CreatedAtUtc)
            .Select(order => new GetAllShippingOrderResponseDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
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