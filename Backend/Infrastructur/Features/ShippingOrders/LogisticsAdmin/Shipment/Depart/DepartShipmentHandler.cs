using Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Depart;

public class DepartShipmentHandler : IDepartShipmentHandler
{
    private readonly AppDbContext _context;

    public DepartShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DepartShipmentResponseDto?> HandleAsync(int shippingOrderId)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x => x.ShippingOrderId == shippingOrderId);

        if (shipment is null)
            return null;

        if (shipment.Status != ShipmentStatus.Loaded)
            return null;

        var shippingOrder = await _context.ShippingOrders
            .FirstOrDefaultAsync(x => x.Id == shippingOrderId);

        if (shippingOrder is null)
            return null;

        if (shippingOrder.Status != ShippingOrderStatus.Confirmed)
            return null;

        var departedAtUtc = DateTime.UtcNow;

        shipment.Status = ShipmentStatus.Departed;
        shipment.ShippedAtUtc = departedAtUtc;

        shippingOrder.Status = ShippingOrderStatus.InTransit;

        await _context.SaveChangesAsync();

        return new DepartShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shippingOrder.Id,
            TrackingNumber = shipment.TrackingNumber,
            ShipmentStatus = shipment.Status,
            ShippingOrderStatus = shippingOrder.Status,
            DepartedAtUtc = departedAtUtc
        };
    }
}