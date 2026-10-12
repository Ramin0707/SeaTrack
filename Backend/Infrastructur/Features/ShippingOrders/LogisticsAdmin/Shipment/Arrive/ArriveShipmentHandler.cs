using Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Arrive;

public class ArriveShipmentHandler : IArriveShipmentHandler
{
    private readonly AppDbContext _context;

    public ArriveShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ArriveShipmentResponseDto?> HandleAsync(
        int shippingOrderId)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x =>
                x.ShippingOrderId == shippingOrderId);

        if (shipment is null)
            return null;

        if (shipment.Status != ShipmentStatus.InTransit)
            return null;

        var shippingOrder = await _context.ShippingOrders
            .FirstOrDefaultAsync(x =>
                x.Id == shippingOrderId);

        if (shippingOrder is null)
            return null;

        if (shippingOrder.Status != ShippingOrderStatus.InTransit)
            return null;

        var arrivedAtUtc = DateTime.UtcNow;

        shipment.Status = ShipmentStatus.Arrived;
        shipment.ArrivedAtUtc = arrivedAtUtc;

        await _context.SaveChangesAsync();

        await _context.SaveChangesAsync();

        return new ArriveShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shippingOrder.Id,
            TrackingNumber = shipment.TrackingNumber,
            ShipmentStatus = shipment.Status,
            ShippingOrderStatus = shippingOrder.Status,
            ArrivedAtUtc = arrivedAtUtc
        };
    }
}