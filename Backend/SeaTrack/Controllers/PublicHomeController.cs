using Application.Features.PublicWebsite.Home.Get.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/home")]
[AllowAnonymous]
public class PublicHomeController : ControllerBase
{
    private readonly IGetPublicHomePageHandler
        _getPublicHomePageHandler;

    public PublicHomeController(
        IGetPublicHomePageHandler getPublicHomePageHandler)
    {
        _getPublicHomePageHandler =
            getPublicHomePageHandler;
    }

    // =========================================================
    // GET: /api/home
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetHomePage()
    {
        var result =
            await _getPublicHomePageHandler.HandleAsync();

        if (result is null)
        {
            return NotFound(new
            {
                message = "Home Page was not found."
            });
        }

        return Ok(result);
    }
}