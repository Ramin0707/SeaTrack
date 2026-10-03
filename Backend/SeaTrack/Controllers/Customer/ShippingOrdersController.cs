using System.Security.Claims;
using Application.Features.Shipping.Customer.Create.DTOs;
using Application.Features.Shipping.Customer.Create.Interfaces;
using Application.Features.Shipping.Customer.GetMy.DTOs;
using Application.Features.Shipping.Customer.GetMy.Interfaces;
using Application.Features.Shipping.Customer.GetById.DTOs;
using Application.Features.Shipping.Customer.GetById.Interfaces;
using Application.Features.Shipping.Customer.Update.DTOs;
using Application.Features.Shipping.Customer.Update.Interfaces;
using Application.Features.Shipping.Customer.Cancel.DTOs;
using Application.Features.Shipping.Customer.Cancel.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.Customer;

[ApiController]
[Route("api/shipping-orders")]
[Authorize(Roles = "Customer")]
public class ShippingOrdersController : ControllerBase
{
    private readonly ICreateShippingOrderHandler _createShippingOrderHandler;
    private readonly IGetMyShippingOrdersHandler _getMyShippingOrdersHandler;
    private readonly IGetShippingOrderByIdHandler _getShippingOrderByIdHandler;
    private readonly IUpdateShippingOrderHandler _updateShippingOrderHandler;
    private readonly ICancelShippingOrderHandler _cancelShippingOrderHandler;

    public ShippingOrdersController(
        ICreateShippingOrderHandler createShippingOrderHandler,
        IGetMyShippingOrdersHandler getMyShippingOrdersHandler,
        IGetShippingOrderByIdHandler getShippingOrderByIdHandler,
        IUpdateShippingOrderHandler updateShippingOrderHandler,
        ICancelShippingOrderHandler cancelShippingOrderHandler)
    {
        _createShippingOrderHandler = createShippingOrderHandler;
        _getMyShippingOrdersHandler = getMyShippingOrdersHandler;
        _getShippingOrderByIdHandler = getShippingOrderByIdHandler;
        _updateShippingOrderHandler = updateShippingOrderHandler;
        _cancelShippingOrderHandler = cancelShippingOrderHandler;
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

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UpdateShippingOrderResponseDto>> Update(
        int id,
        UpdateShippingOrderRequestDto request)
    {
        var customerId = User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result = await _updateShippingOrderHandler.HandleAsync(
            id,
            customerId,
            request);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPatch("{id:int}/cancel")]
    public async Task<ActionResult<CancelShippingOrderResponseDto>> Cancel(
        int id)
    {
        var customerId = User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result = await _cancelShippingOrderHandler.HandleAsync(
            id,
            customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}