using Application.Features.Shipping.Customer.Create.DTOs;
using Application.Features.Shipping.Customer.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;

namespace Infrastructur.Features.ShippingOrders.Customer.Create;

public class CreateShippingOrderHandler : ICreateShippingOrderHandler
{
    private readonly AppDbContext _dbContext;

    public CreateShippingOrderHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateShippingOrderResponseDto> HandleAsync(
        string customerId,
        CreateShippingOrderRequestDto request)
    {
        var shippingOrder = new ShippingOrder
        {
            CustomerId = customerId,
            CargoType = request.CargoType,
            Weight = request.Weight,
            Volume = request.Volume,
            OriginPort = request.OriginPort,
            DestinationPort = request.DestinationPort,
            ContainerType = request.ContainerType,
            DesiredShippingDate = request.DesiredShippingDate
        };

        _dbContext.ShippingOrders.Add(shippingOrder);

        await _dbContext.SaveChangesAsync();

        return new CreateShippingOrderResponseDto
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