using Application.Features.PublicWebsite.Services.Get.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.PublicWebsite;

[ApiController]
[Route("api/services")]
[AllowAnonymous]
public class ServicesController : ControllerBase
{
    private readonly IGetPublicServicesPageHandler _handler;

    public ServicesController(
        IGetPublicServicesPageHandler handler)
    {
        _handler = handler;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _handler.HandleAsync();

        if (result is null)
        {
            return NotFound(new
            {
                message = "Services page was not found."
            });
        }

        return Ok(result);
    }
}