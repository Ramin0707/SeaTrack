
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

        string? voyageNumber = null;

        var portCalls = new List<TrackingPortCallDto>();

        var voyageId = shipment.ShippingOrder.VoyageId;

        if (voyageId.HasValue)
        {
            voyageNumber = await _dbContext.Voyages
                .AsNoTracking()
                .Where(x => x.Id == voyageId.Value)
                .Select(x => x.VoyageNumber)
                .FirstOrDefaultAsync();

            portCalls = await _dbContext.PortCalls
                .AsNoTracking()
                .Where(x =>
                    x.VoyageId == voyageId.Value &&
                    x.IsActive)
                .OrderBy(x => x.EstimatedArrivalUtc)
                .Select(x => new TrackingPortCallDto
                {
                    PortCallId = x.Id,
                    PortName = x.Port.Name,
                    TerminalName = x.Terminal.Name,
                    BerthName = x.Berth.Name,
                    EstimatedArrivalUtc = x.EstimatedArrivalUtc,
                    EstimatedDepartureUtc = x.EstimatedDepartureUtc,
                    ActualArrivalUtc = x.ActualArrivalUtc,
                    ActualDepartureUtc = x.ActualDepartureUtc
                })
                .ToListAsync();
        }

        return new TrackingResponseDto
        {
            TrackingNumber = shipment.TrackingNumber,

            Status = shipment.Status,

            OriginPort = shipment.ShippingOrder.OriginPort,

            DestinationPort = shipment.ShippingOrder.DestinationPort,

            VoyageNumber = voyageNumber,

            CreatedAtUtc = shipment.CreatedAtUtc,

            LoadedAtUtc = shipment.LoadedAtUtc,

            ShippedAtUtc = shipment.ShippedAtUtc,

            ArrivedAtUtc = shipment.ArrivedAtUtc,

            UnloadedAtUtc = shipment.UnloadedAtUtc,

            DeliveredAtUtc = shipment.DeliveredAtUtc,

            PortCalls = portCalls
        };
    }
}
