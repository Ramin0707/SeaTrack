using Application.Features.PublicWebsite.About.Get.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/about")]
[AllowAnonymous]
public class PublicAboutController : ControllerBase
{
    private readonly IGetPublicAboutPageHandler
        _getPublicAboutPageHandler;

    public PublicAboutController(
        IGetPublicAboutPageHandler getPublicAboutPageHandler)
    {
        _getPublicAboutPageHandler =
            getPublicAboutPageHandler;
    }

    // =========================================================
    // GET: /api/about
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAboutPage()
    {
        var result =
            await _getPublicAboutPageHandler.HandleAsync();

        if (result is null)
        {
            return NotFound(new
            {
                message = "About Page was not found."
            });
        }

        return Ok(result);
    }
}