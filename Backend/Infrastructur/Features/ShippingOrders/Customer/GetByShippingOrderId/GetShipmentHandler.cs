using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.DTOs;
using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Shipment.GetByShippingOrderId;

public class GetShipmentHandler : IGetShipmentHandler
{
    private readonly AppDbContext _context;

    public GetShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetShipmentResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId)
    {
        var order = await _context.ShippingOrders
            .FirstOrDefaultAsync(x =>
                x.Id == shippingOrderId &&
                x.CustomerId == customerId);

        if (order is null)
            return null;

        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x =>
                x.ShippingOrderId == shippingOrderId);

        if (shipment is null)
            return null;

        return new GetShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shipment.ShippingOrderId,
            TrackingNumber = shipment.TrackingNumber,
            Status = shipment.Status,
            CreatedAtUtc = shipment.CreatedAtUtc,
            ShippedAtUtc = shipment.ShippedAtUtc,
            DeliveredAtUtc = shipment.DeliveredAtUtc
        };
    }
}