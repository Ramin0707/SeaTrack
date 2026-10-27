using Application.Features.WebSiteAdmin.About.Create.DTOs;
using Application.Features.WebSiteAdmin.About.Create.Interfaces;
using Application.Features.WebSiteAdmin.About.Delete.Interfaces;
using Application.Features.WebSiteAdmin.About.Get.Interfaces;
using Application.Features.WebSiteAdmin.About.Reorder.DTOs;
using Application.Features.WebSiteAdmin.About.Reorder.Interfaces;
using Application.Features.WebSiteAdmin.About.Update.DTOs;
using Application.Features.WebSiteAdmin.About.Update.Interfaces;
using Application.Features.WebSiteAdmin.About.Visibility.DTOs;
using Application.Features.WebSiteAdmin.About.Visibility.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.WebsiteAdmin;

[ApiController]
[Route("api/admin/cms/about")]
[Authorize(Roles = "Admin")]
public class AboutCmsController : ControllerBase
{
    private readonly IGetAboutPageHandler
        _getAboutPageHandler;

    private readonly ICreateAboutPageSectionHandler
        _createAboutPageSectionHandler;

    private readonly IUpdateAboutPageSectionHandler
        _updateAboutPageSectionHandler;

    private readonly IDeleteAboutPageSectionHandler
        _deleteAboutPageSectionHandler;

    private readonly IUpdateAboutPageSectionVisibilityHandler
        _updateAboutPageSectionVisibilityHandler;

    private readonly IReorderAboutPageSectionsHandler
        _reorderAboutPageSectionsHandler;

    public AboutCmsController(
        IGetAboutPageHandler getAboutPageHandler,
        ICreateAboutPageSectionHandler createAboutPageSectionHandler,
        IUpdateAboutPageSectionHandler updateAboutPageSectionHandler,
        IDeleteAboutPageSectionHandler deleteAboutPageSectionHandler,
        IUpdateAboutPageSectionVisibilityHandler
            updateAboutPageSectionVisibilityHandler,
        IReorderAboutPageSectionsHandler
            reorderAboutPageSectionsHandler)
    {
        _getAboutPageHandler =
            getAboutPageHandler;

        _createAboutPageSectionHandler =
            createAboutPageSectionHandler;

        _updateAboutPageSectionHandler =
            updateAboutPageSectionHandler;

        _deleteAboutPageSectionHandler =
            deleteAboutPageSectionHandler;

        _updateAboutPageSectionVisibilityHandler =
            updateAboutPageSectionVisibilityHandler;

        _reorderAboutPageSectionsHandler =
            reorderAboutPageSectionsHandler;
    }


    // =========================================================
    // GET - About Page
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result =
            await _getAboutPageHandler.HandleAsync();

        return Ok(result);
    }


    // =========================================================
    // POST - Create About Page Section
    // =========================================================

    [HttpPost("sections")]
    public async Task<IActionResult> CreateSection(
        [FromBody] CreateAboutPageSectionRequestDto request)
    {
        try
        {
            var result =
                await _createAboutPageSectionHandler
                    .HandleAsync(request);

            return StatusCode(
                StatusCodes.Status201Created,
                result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }


    // =========================================================
    // PUT - Update About Page Section
    // =========================================================

    [HttpPut("sections/{id:int}")]
    public async Task<IActionResult> UpdateSection(
        int id,
        [FromBody] UpdateAboutPageSectionRequestDto request)
    {
        try
        {
            var result =
                await _updateAboutPageSectionHandler
                    .HandleAsync(
                        id,
                        request);

            if (result is null)
            {
                return NotFound(new
                {
                    message =
                        "About page section was not found."
                });
            }

            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }


    // =========================================================
    // PATCH - Show / Hide About Page Section
    // =========================================================

    [HttpPatch("sections/{id:int}/visibility")]
    public async Task<IActionResult> UpdateSectionVisibility(
        int id,
        [FromBody]
        UpdateAboutPageSectionVisibilityRequestDto request)
    {
        var updated =
            await _updateAboutPageSectionVisibilityHandler
                .HandleAsync(
                    id,
                    request);

        if (!updated)
        {
            return NotFound(new
            {
                message =
                    "About page section was not found."
            });
        }

        return Ok(new
        {
            message = request.IsVisible
                ? "About page section is now visible."
                : "About page section is now hidden."
        });
    }


    // =========================================================
    // PATCH - Reorder About Page Sections
    // =========================================================

    [HttpPatch("sections/reorder")]
    public async Task<IActionResult> ReorderSections(
        [FromBody] ReorderAboutPageSectionsRequestDto request)
    {
        var reordered =
            await _reorderAboutPageSectionsHandler
                .HandleAsync(request);

        if (!reordered)
        {
            return BadRequest(new
            {
                message =
                    "Unable to reorder About page sections. Check the supplied section IDs and order values."
            });
        }

        return Ok(new
        {
            message =
                "About page sections reordered successfully."
        });
    }


    // =========================================================
    // DELETE - Delete About Page Section
    // =========================================================

    [HttpDelete("sections/{id:int}")]
    public async Task<IActionResult> DeleteSection(int id)
    {
        var deleted =
            await _deleteAboutPageSectionHandler
                .HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message =
                    "About page section was not found."
            });
        }

        return Ok(new
        {
            message =
                "About page section deleted successfully."
        });
    }
}