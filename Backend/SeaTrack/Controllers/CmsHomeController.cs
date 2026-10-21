using Application.Features.WebSiteAdmin.Home.Create.DTOs;
using Application.Features.WebSiteAdmin.Home.Create.Interfaces;
using Application.Features.WebSiteAdmin.Home.Delete.Interfaces;
using Application.Features.WebSiteAdmin.Home.Get.Interfaces;
using Application.Features.WebSiteAdmin.Home.Reorder.DTOs;
using Application.Features.WebSiteAdmin.Home.Reorder.Interfaces;
using Application.Features.WebSiteAdmin.Home.Update.DTOs;
using Application.Features.WebSiteAdmin.Home.Update.Interfaces;
using Application.Features.WebSiteAdmin.Home.Visibility.DTOs;
using Application.Features.WebSiteAdmin.Home.Visibility.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/admin/cms/home")]
[Authorize(Roles = "Admin")]
public class CmsHomeController : ControllerBase
{
    private readonly IGetHomePageHandler _getHomePageHandler;
    private readonly ICreateHomePageSectionHandler _createSectionHandler;
    private readonly IUpdateHomePageSectionHandler _updateSectionHandler;
    private readonly IDeleteHomePageSectionHandler _deleteSectionHandler;
    private readonly IUpdateHomePageSectionVisibilityHandler
        _visibilityHandler;
    private readonly IReorderHomePageSectionsHandler _reorderHandler;

    public CmsHomeController(
        IGetHomePageHandler getHomePageHandler,
        ICreateHomePageSectionHandler createSectionHandler,
        IUpdateHomePageSectionHandler updateSectionHandler,
        IDeleteHomePageSectionHandler deleteSectionHandler,
        IUpdateHomePageSectionVisibilityHandler visibilityHandler,
        IReorderHomePageSectionsHandler reorderHandler)
    {
        _getHomePageHandler = getHomePageHandler;
        _createSectionHandler = createSectionHandler;
        _updateSectionHandler = updateSectionHandler;
        _deleteSectionHandler = deleteSectionHandler;
        _visibilityHandler = visibilityHandler;
        _reorderHandler = reorderHandler;
    }

    // =========================================================
    // GET: /api/admin/cms/home
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetHomePage()
    {
        var result =
            await _getHomePageHandler.HandleAsync();

        return Ok(result);
    }

    // =========================================================
    // POST: /api/admin/cms/home/sections
    // =========================================================

    [HttpPost("sections")]
    public async Task<IActionResult> CreateSection(
        [FromBody] CreateHomePageSectionRequestDto request)
    {
        try
        {
            var result =
                await _createSectionHandler.HandleAsync(
                    request);

            return CreatedAtAction(
                nameof(GetHomePage),
                null,
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
    // PUT: /api/admin/cms/home/sections/{id}
    // =========================================================

    [HttpPut("sections/{id:int}")]
    public async Task<IActionResult> UpdateSection(
        int id,
        [FromBody] UpdateHomePageSectionRequestDto request)
    {
        try
        {
            var result =
                await _updateSectionHandler.HandleAsync(
                    id,
                    request);

            if (result is null)
            {
                return NotFound(new
                {
                    message =
                        $"Home Page section with ID {id} was not found."
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
    // DELETE: /api/admin/cms/home/sections/{id}
    // =========================================================

    [HttpDelete("sections/{id:int}")]
    public async Task<IActionResult> DeleteSection(
        int id)
    {
        var deleted =
            await _deleteSectionHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message =
                    $"Home Page section with ID {id} was not found."
            });
        }

        return Ok(new
        {
            message =
                "Home Page section deleted successfully.",
            sectionId = id
        });
    }

    // =========================================================
    // PATCH: /api/admin/cms/home/sections/{id}/visibility
    // =========================================================

    [HttpPatch("sections/{id:int}/visibility")]
    public async Task<IActionResult> UpdateVisibility(
        int id,
        [FromBody]
        UpdateHomePageSectionVisibilityRequestDto request)
    {
        var result =
            await _visibilityHandler.HandleAsync(
                id,
                request);

        if (result is null)
        {
            return NotFound(new
            {
                message =
                    $"Home Page section with ID {id} was not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // PUT: /api/admin/cms/home/sections/reorder
    // =========================================================

    [HttpPut("sections/reorder")]
    public async Task<IActionResult> ReorderSections(
        [FromBody] ReorderHomePageSectionsRequestDto request)
    {
        try
        {
            var result =
                await _reorderHandler.HandleAsync(
                    request);

            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }
}