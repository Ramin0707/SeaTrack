using Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "Admin,Operator")]
public class CustomersController : ControllerBase
{
    private readonly IGetCustomersHandler _getCustomersHandler;

    public CustomersController(IGetCustomersHandler getCustomersHandler)
    {
        _getCustomersHandler = getCustomersHandler;
    }

    [HttpGet]
    public async Task<ActionResult<List<GetCustomerResponseDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] bool? emailConfirmed)
    {
        var result = await _getCustomersHandler.HandleAsync(
            search,
            emailConfirmed);

        return Ok(result);
    }
}