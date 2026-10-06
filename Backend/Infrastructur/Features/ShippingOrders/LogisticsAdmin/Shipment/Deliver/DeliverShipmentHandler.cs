using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Deliver;

public class DeliverShipmentHandler : IDeliverShipmentHandler
{
    private readonly AppDbContext _context;

    public DeliverShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DeliverShipmentResponseDto?> HandleAsync(
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

        var deliveredAtUtc = DateTime.UtcNow;

        shipment.Status = ShipmentStatus.Delivered;
        shipment.DeliveredAtUtc = deliveredAtUtc;

        shippingOrder.Status = ShippingOrderStatus.Delivered;

        await _context.SaveChangesAsync();

        return new DeliverShipmentResponseDto
        {
            ShipmentId = shipment.Id,
            ShippingOrderId = shippingOrder.Id,
            TrackingNumber = shipment.TrackingNumber,
            ShipmentStatus = shipment.Status,
            ShippingOrderStatus = shippingOrder.Status,
            DeliveredAtUtc = shipment.DeliveredAtUtc
        };
    }
}