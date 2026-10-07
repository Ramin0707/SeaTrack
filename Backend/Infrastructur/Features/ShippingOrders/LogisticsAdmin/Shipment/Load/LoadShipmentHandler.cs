using Application.Features.Shipping.LogisticsAdmin.Shipment.Load.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Load.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Load;

public class LoadShipmentHandler : ILoadShipmentHandler
{
    private readonly AppDbContext _context;

    public LoadShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LoadShipmentResponseDto?> HandleAsync(int shippingOrderId)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x => x.ShippingOrderId == shippingOrderId);

        if (shipment is null)
            return null;

        if (shipment.Status != ShipmentStatus.Preparing)
            return null;

        var shippingOrder = await _context.ShippingOrders
            .FirstOrDefaultAsync(x => x.Id == shippingOrderId);

        if (shippingOrder is null)
            return null;

        if (shippingOrder.Status != ShippingOrderStatus.Confirmed)
            return null;

        shipment.Status = ShipmentStatus.Loaded;

        await _context.SaveChangesAsync();

        return new LoadShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shippingOrder.Id,
            TrackingNumber = shipment.TrackingNumber,
            ShipmentStatus = shipment.Status
        };
    }
}