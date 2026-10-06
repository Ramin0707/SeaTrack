using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.DTOs;
using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Public.Tracking.GetByTrackingNumber;

public class GetTrackingByTrackingNumberHandler
    : IGetTrackingByTrackingNumberHandler
{
    private readonly AppDbContext _dbContext;

    public GetTrackingByTrackingNumberHandler(
        AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TrackingResponseDto?> HandleAsync(
        string trackingNumber)
    {
        if (string.IsNullOrWhiteSpace(trackingNumber))
        {
            return null;
        }

        var normalizedTrackingNumber = trackingNumber.Trim();

        var shipment = await _dbContext.Shipments
            .AsNoTracking()
            .Include(x => x.ShippingOrder)
            .FirstOrDefaultAsync(x =>
                x.TrackingNumber == normalizedTrackingNumber);

        if (shipment is null)
        {
            return null;
        }

        return new TrackingResponseDto
        {
            TrackingNumber = shipment.TrackingNumber,
            Status = shipment.Status,

            OriginPort = shipment.ShippingOrder.OriginPort,
            DestinationPort = shipment.ShippingOrder.DestinationPort,

            CreatedAtUtc = shipment.CreatedAtUtc,
            ShippedAtUtc = shipment.ShippedAtUtc,
            DeliveredAtUtc = shipment.DeliveredAtUtc
        };
    }
}