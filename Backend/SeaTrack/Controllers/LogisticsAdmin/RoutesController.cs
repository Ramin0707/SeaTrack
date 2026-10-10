using Application.Features.Logistics.Routes.Create.DTOs;
using Application.Features.Logistics.Routes.Create.Interfaces;
using Application.Features.Logistics.Routes.Delete.Interfaces;
using Application.Features.Logistics.Routes.GetAll.Interfaces;
using Application.Features.Logistics.Routes.GetById.Interfaces;
using Application.Features.Logistics.Routes.Update.DTOs;
using Application.Features.Logistics.Routes.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/routes")]
[Authorize(Roles = "Admin,Operator")]
public class RoutesController : ControllerBase
{
    private readonly ICreateRouteHandler _createRouteHandler;
    private readonly IGetAllRoutesHandler _getAllRoutesHandler;
    private readonly IGetRouteByIdHandler _getRouteByIdHandler;
    private readonly IUpdateRouteHandler _updateRouteHandler;
    private readonly IDeleteRouteHandler _deleteRouteHandler;
    public RoutesController(
    ICreateRouteHandler createRouteHandler,
    IGetAllRoutesHandler getAllRoutesHandler,
    IGetRouteByIdHandler getRouteByIdHandler,
    IUpdateRouteHandler updateRouteHandler,
    IDeleteRouteHandler deleteRouteHandler)
    {
        _createRouteHandler = createRouteHandler;
        _getAllRoutesHandler = getAllRoutesHandler;
        _getRouteByIdHandler = getRouteByIdHandler;
        _updateRouteHandler = updateRouteHandler;
        _deleteRouteHandler = deleteRouteHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateRouteRequestDto request)
    {
        var route = await _createRouteHandler.HandleAsync(request);

        if (route is null)
        {
            return BadRequest(new
            {
                message = "Route could not be created. Check ports, route code and origin/destination."
            });
        }

        return StatusCode(StatusCodes.Status201Created, route);
    }


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var routes = await _getAllRoutesHandler.HandleAsync();

        return Ok(routes);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var route = await _getRouteByIdHandler.HandleAsync(id);

        if (route is null)
        {
            return NotFound(new
            {
                message = "Route not found."
            });
        }

        return Ok(route);
    }



    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdateRouteRequestDto request)
    {
        var route = await _updateRouteHandler.HandleAsync(id, request);

        if (route is null)
        {
            return BadRequest(new
            {
                message = "Route not found, port not found, route code already exists, or origin and destination ports are the same."
            });
        }

        return Ok(route);
    }




    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deleteRouteHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Route not found."
            });
        }

        return NoContent();
    }
}