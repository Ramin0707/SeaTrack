using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Start;

public class StartShipmentHandler : IStartShipmentHandler
{
    private readonly AppDbContext _context;

    public StartShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<StartShipmentResponseDto?> HandleAsync(int shippingOrderId)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x => x.ShippingOrderId == shippingOrderId);

        if (shipment is null)
            return null;

        // Shipment должен уже покинуть порт
        if (shipment.Status != ShipmentStatus.Departed)
            return null;

        var shippingOrder = await _context.ShippingOrders
            .FirstOrDefaultAsync(x => x.Id == shippingOrderId);

        if (shippingOrder is null)
            return null;

        // После Depart заказ уже находится в InTransit
        if (shippingOrder.Status != ShippingOrderStatus.InTransit)
            return null;

        // Depart уже установил ShippedAtUtc.
        // Здесь дату отправления повторно не меняем.
        shipment.Status = ShipmentStatus.InTransit;

        await _context.SaveChangesAsync();

        return new StartShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shippingOrder.Id,
            TrackingNumber = shipment.TrackingNumber,
            ShipmentStatus = shipment.Status,
            ShippingOrderStatus = shippingOrder.Status,
            ShippedAtUtc = shipment.ShippedAtUtc
        };
    }
}