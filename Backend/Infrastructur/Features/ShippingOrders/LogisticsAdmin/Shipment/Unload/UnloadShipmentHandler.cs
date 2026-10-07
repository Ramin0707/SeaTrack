using Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Unload;

public class UnloadShipmentHandler : IUnloadShipmentHandler
{
    private readonly AppDbContext _context;

    public UnloadShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UnloadShipmentResponseDto?> HandleAsync(
        int shippingOrderId)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x =>
                x.ShippingOrderId == shippingOrderId);

        if (shipment is null)
            return null;

        if (shipment.Status != ShipmentStatus.Arrived)
            return null;

        var shippingOrder = await _context.ShippingOrders
            .FirstOrDefaultAsync(x =>
                x.Id == shippingOrderId);

        if (shippingOrder is null)
            return null;

        if (shippingOrder.Status != ShippingOrderStatus.InTransit)
            return null;

        shipment.Status = ShipmentStatus.Unloaded;

        await _context.SaveChangesAsync();

        return new UnloadShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shippingOrder.Id,
            TrackingNumber = shipment.TrackingNumber,
            ShipmentStatus = shipment.Status,
            ShippingOrderStatus = shippingOrder.Status,
            UnloadedAtUtc = DateTime.UtcNow
        };
    }
}