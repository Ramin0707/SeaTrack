using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.DTOs;

namespace Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.Interfaces;

public interface IGetTrackingByTrackingNumberHandler
{
    Task<TrackingResponseDto?> HandleAsync(string trackingNumber);
}