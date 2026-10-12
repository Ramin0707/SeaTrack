using Application.Features.Shipping.LogisticsAdmin.Shipment.GetByShippingOrderId.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.GetByShippingOrderId.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.GetByShippingOrderId;

public class GetShipmentHandler : IGetShipmentHandler
{
    private readonly AppDbContext _context;

    public GetShipmentHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetShipmentResponseDto?> HandleAsync(
        int shippingOrderId)
    {
        var shipment = await _context.Shipments
            .AsNoTracking()
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
            LoadedAtUtc = shipment.LoadedAtUtc,
            ShippedAtUtc = shipment.ShippedAtUtc,
            ArrivedAtUtc = shipment.ArrivedAtUtc,
            UnloadedAtUtc = shipment.UnloadedAtUtc,
            DeliveredAtUtc = shipment.DeliveredAtUtc
        };
    }
}