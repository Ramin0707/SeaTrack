using Application.Features.WebSiteAdmin.Services.Get.Interfaces;
using Application.Features.WebSiteAdmin.Services.Update.DTOs;
using Application.Features.WebSiteAdmin.Services.Update.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Create.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Create.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Update.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Update.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Delete.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Visibility.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Visibility.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Reorder.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Reorder.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.WebsiteAdmin;

[ApiController]
[Route("api/admin/cms/services")]
[Authorize(Roles = "Admin")]
public class ServicesCmsController : ControllerBase
{
    private readonly IGetServicesPageHandler _getServicesPageHandler;
    private readonly IUpdateServicesPageHandler _updateServicesPageHandler;
    private readonly ICreateServiceItemHandler _createServiceItemHandler;
    private readonly IUpdateServiceItemHandler _updateServiceItemHandler;
    private readonly IDeleteServiceItemHandler _deleteServiceItemHandler;
    private readonly IUpdateServiceItemVisibilityHandler
        _updateServiceItemVisibilityHandler;
    private readonly IReorderServiceItemsHandler
        _reorderServiceItemsHandler;

    public ServicesCmsController(
        IGetServicesPageHandler getServicesPageHandler,
        IUpdateServicesPageHandler updateServicesPageHandler,
        ICreateServiceItemHandler createServiceItemHandler,
        IUpdateServiceItemHandler updateServiceItemHandler,
        IDeleteServiceItemHandler deleteServiceItemHandler,
        IUpdateServiceItemVisibilityHandler
            updateServiceItemVisibilityHandler,
        IReorderServiceItemsHandler reorderServiceItemsHandler)
    {
        _getServicesPageHandler = getServicesPageHandler;
        _updateServicesPageHandler = updateServicesPageHandler;
        _createServiceItemHandler = createServiceItemHandler;
        _updateServiceItemHandler = updateServiceItemHandler;
        _deleteServiceItemHandler = deleteServiceItemHandler;
        _updateServiceItemVisibilityHandler =
            updateServiceItemVisibilityHandler;
        _reorderServiceItemsHandler =
            reorderServiceItemsHandler;
    }

    // =========================================================
    // GET - Services Page
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result =
            await _getServicesPageHandler.HandleAsync();

        if (result is null)
        {
            return NotFound(new
            {
                message = "Services page was not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // PUT - Update Services Page
    // =========================================================

    [HttpPut]
    public async Task<IActionResult> Update(
        [FromBody] UpdateServicesPageRequestDto request)
    {
        var updated =
            await _updateServicesPageHandler.HandleAsync(request);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Services page was not found."
            });
        }

        return Ok(new
        {
            message = "Services page updated successfully."
        });
    }

    // =========================================================
    // POST - Create Service Item
    // =========================================================

    [HttpPost("items")]
    public async Task<IActionResult> CreateServiceItem(
        [FromBody] CreateServiceItemRequestDto request)
    {
        var serviceItemId =
            await _createServiceItemHandler.HandleAsync(request);

        if (serviceItemId is null)
        {
            return NotFound(new
            {
                message = "Services page was not found."
            });
        }

        return StatusCode(
            StatusCodes.Status201Created,
            new
            {
                id = serviceItemId.Value,
                message = "Service item created successfully."
            });
    }

    // =========================================================
    // PUT - Update Service Item
    // =========================================================

    [HttpPut("items/{id:int}")]
    public async Task<IActionResult> UpdateServiceItem(
        int id,
        [FromBody] UpdateServiceItemRequestDto request)
    {
        var updated =
            await _updateServiceItemHandler.HandleAsync(
                id,
                request);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Service item was not found."
            });
        }

        return Ok(new
        {
            message = "Service item updated successfully."
        });
    }

    // =========================================================
    // PATCH - Show / Hide Service Item
    // =========================================================

    [HttpPatch("items/{id:int}/visibility")]
    public async Task<IActionResult> UpdateServiceItemVisibility(
        int id,
        [FromBody] UpdateServiceItemVisibilityRequestDto request)
    {
        var updated =
            await _updateServiceItemVisibilityHandler.HandleAsync(
                id,
                request);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Service item was not found."
            });
        }

        return Ok(new
        {
            message = request.IsVisible
                ? "Service item is now visible."
                : "Service item is now hidden."
        });
    }

    // =========================================================
    // PATCH - Reorder Service Items
    // =========================================================

    [HttpPatch("items/reorder")]
    public async Task<IActionResult> ReorderServiceItems(
        [FromBody] ReorderServiceItemsRequestDto request)
    {
        var reordered =
            await _reorderServiceItemsHandler.HandleAsync(request);

        if (!reordered)
        {
            return BadRequest(new
            {
                message =
                    "Unable to reorder service items. Check the supplied item IDs and order values."
            });
        }

        return Ok(new
        {
            message = "Service items reordered successfully."
        });
    }

    // =========================================================
    // DELETE - Delete Service Item
    // =========================================================

    [HttpDelete("items/{id:int}")]
    public async Task<IActionResult> DeleteServiceItem(int id)
    {
        var deleted =
            await _deleteServiceItemHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Service item was not found."
            });
        }

        return Ok(new
        {
            message = "Service item deleted successfully."
        });
    }
}