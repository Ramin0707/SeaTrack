using Application.Features.Shipping.LogisticsAdmin.GetById.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.GetById;

public class GetShippingOrderByIdHandler : IGetShippingOrderByIdHandler
{
    private readonly AppDbContext _dbContext;

    public GetShippingOrderByIdHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetShippingOrderByIdResponseDto?> HandleAsync(int id)
    {
        return await _dbContext.ShippingOrders
            .AsNoTracking()
            .Where(order => order.Id == id)
            .Select(order => new GetShippingOrderByIdResponseDto
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
                CreatedAtUtc = order.CreatedAtUtc,
                ContainerId = order.ContainerId,
                ContainerNumber = order.Container != null
    ? order.Container.ContainerNumber
    : null,

                VoyageId = order.VoyageId,
                VoyageNumber = order.Voyage != null
    ? order.Voyage.VoyageNumber
    : null,

                VesselName = order.Voyage != null
    ? order.Voyage.Vessel.Name
    : null,

                RouteName = order.Voyage != null
    ? order.Voyage.Route.Name
    : null
            })
            .FirstOrDefaultAsync();
    }
}