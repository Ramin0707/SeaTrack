using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.DTOs;
using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.Public;

[ApiController]
[Route("api/tracking")]
[AllowAnonymous]
public class TrackingController : ControllerBase
{
    private readonly IGetTrackingByTrackingNumberHandler
        _getTrackingByTrackingNumberHandler;

    public TrackingController(
        IGetTrackingByTrackingNumberHandler getTrackingByTrackingNumberHandler)
    {
        _getTrackingByTrackingNumberHandler =
            getTrackingByTrackingNumberHandler;
    }

    [HttpGet("{trackingNumber}")]
    public async Task<ActionResult<TrackingResponseDto>> GetByTrackingNumber(
        string trackingNumber)
    {
        var result = await _getTrackingByTrackingNumberHandler
            .HandleAsync(trackingNumber);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}