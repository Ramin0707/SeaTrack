using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Create;

public class CreateShipmentHandler : ICreateShipmentHandler
{
    private readonly AppDbContext _context;

    public CreateShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateShipmentResponseDto?> HandleAsync(int shippingOrderId)
    {
        var order = await _context.ShippingOrders
            .FirstOrDefaultAsync(x => x.Id == shippingOrderId);

        if (order is null)
            return null;

        if (order.Status != ShippingOrderStatus.Confirmed)
            return null;

        var shipmentExists = await _context.Shipments
            .AnyAsync(x => x.ShippingOrderId == shippingOrderId);

        if (shipmentExists)
            return null;

        var shipment = new Domain.Entities.Shipment
        {
            ShippingOrderId = shippingOrderId,
            TrackingNumber = GenerateTrackingNumber(shippingOrderId),
            Status = ShipmentStatus.Preparing,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Shipments.Add(shipment);

        await _context.SaveChangesAsync();

        return new CreateShipmentResponseDto
        {
            Id = shipment.Id,
            ShippingOrderId = shipment.ShippingOrderId,
            TrackingNumber = shipment.TrackingNumber,
            Status = shipment.Status,
            CreatedAtUtc = shipment.CreatedAtUtc
        };
    }

    private static string GenerateTrackingNumber(int shippingOrderId)
    {
        return $"ST-{DateTime.UtcNow:yyyyMMddHHmmss}-{shippingOrderId:D6}";
    }
}