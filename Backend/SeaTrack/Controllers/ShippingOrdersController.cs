using System.Security.Claims;
using Application.Features.ShippingOrders.Create.DTOs;
using Application.Features.ShippingOrders.Create.Interfaces;
using Application.Features.ShippingOrders.GetMy.DTOs;
using Application.Features.ShippingOrders.GetMy.Interfaces;
using Application.Features.Shipping.GetById.DTOs;
using Application.Features.Shipping.GetById.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/shipping-orders")]
[Authorize]
public class ShippingOrdersController : ControllerBase
{
    private readonly ICreateShippingOrderHandler _createShippingOrderHandler;
    private readonly IGetMyShippingOrdersHandler _getMyShippingOrdersHandler;
    private readonly IGetShippingOrderByIdHandler _getShippingOrderByIdHandler;

    public ShippingOrdersController(
        ICreateShippingOrderHandler createShippingOrderHandler,
        IGetMyShippingOrdersHandler getMyShippingOrdersHandler,
        IGetShippingOrderByIdHandler getShippingOrderByIdHandler)
    {
        _createShippingOrderHandler = createShippingOrderHandler;
        _getMyShippingOrdersHandler = getMyShippingOrdersHandler;
        _getShippingOrderByIdHandler = getShippingOrderByIdHandler;
    }

    [HttpPost]
    public async Task<ActionResult<CreateShippingOrderResponseDto>> Create(
        CreateShippingOrderRequestDto request)
    {
        var customerId = User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result = await _createShippingOrderHandler.HandleAsync(
            customerId,
            request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<GetMyShippingOrderResponseDto>>> GetMy()
    {
        var customerId = User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result = await _getMyShippingOrdersHandler.HandleAsync(customerId);

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetShippingOrderByIdResponseDto>> GetById(
        int id)
    {
        var customerId = User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result = await _getShippingOrderByIdHandler.HandleAsync(
            id,
            customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}