using Application.Features.Shipping.Customer.Update.DTOs;
using Application.Features.Shipping.Customer.Update.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Update;

public class UpdateShippingOrderHandler : IUpdateShippingOrderHandler
{
    private readonly AppDbContext _dbContext;

    public UpdateShippingOrderHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateShippingOrderResponseDto?> HandleAsync(
        int id,
        string customerId,
        UpdateShippingOrderRequestDto request)
    {
        var shippingOrder = await _dbContext.ShippingOrders
            .FirstOrDefaultAsync(order =>
                order.Id == id &&
                order.CustomerId == customerId);

        if (shippingOrder is null)
        {
            return null;
        }

        if (shippingOrder.Status != ShippingOrderStatus.AwaitingQuote)
        {
            return null;
        }

        shippingOrder.CargoType = request.CargoType;
        shippingOrder.Weight = request.Weight;
        shippingOrder.Volume = request.Volume;
        shippingOrder.OriginPort = request.OriginPort;
        shippingOrder.DestinationPort = request.DestinationPort;
        shippingOrder.ContainerType = request.ContainerType;
        shippingOrder.DesiredShippingDate = request.DesiredShippingDate;

        await _dbContext.SaveChangesAsync();

        return new UpdateShippingOrderResponseDto
        {
            Id = shippingOrder.Id,
            CargoType = shippingOrder.CargoType,
            Weight = shippingOrder.Weight,
            Volume = shippingOrder.Volume,
            OriginPort = shippingOrder.OriginPort,
            DestinationPort = shippingOrder.DestinationPort,
            ContainerType = shippingOrder.ContainerType,
            DesiredShippingDate = shippingOrder.DesiredShippingDate,
            Status = shippingOrder.Status,
            CreatedAtUtc = shippingOrder.CreatedAtUtc
        };
    }
}