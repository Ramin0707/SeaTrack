using Application.Features.Shipping.LogisticsAdmin.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/shipping-orders")]
[Authorize(Roles = "Admin,Operator")]
public class ShippingOrdersController : ControllerBase
{
    private readonly IGetAllShippingOrdersHandler _getAllShippingOrdersHandler;

    public ShippingOrdersController(
        IGetAllShippingOrdersHandler getAllShippingOrdersHandler)
    {
        _getAllShippingOrdersHandler = getAllShippingOrdersHandler;
    }

    [HttpGet]
    public async Task<ActionResult<List<GetAllShippingOrderResponseDto>>> GetAll()
    {
        var result = await _getAllShippingOrdersHandler.HandleAsync();

        return Ok(result);
    }
}