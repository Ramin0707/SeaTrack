using Application.Features.Logistics.Ports.Create.DTOs;
using Application.Features.Logistics.Ports.Create.Interfaces;
using Application.Features.Logistics.Ports.GetAll.Interfaces;
using Application.Features.Logistics.Ports.GetById.Interfaces;
using Application.Features.Logistics.Ports.Update.DTOs;
using Application.Features.Logistics.Ports.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Logistics.Ports.Delete.Interfaces;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/ports")]
[Authorize(Roles = "Admin,Operator")]
public class PortsController : ControllerBase
{
    private readonly IGetAllPortsHandler _getAllPortsHandler;
    private readonly ICreatePortHandler _createPortHandler;
    private readonly IGetPortByIdHandler _getPortByIdHandler;
    private readonly IUpdatePortHandler _updatePortHandler;
    private readonly IDeletePortHandler _deletePortHandler;
    public PortsController(
      IGetAllPortsHandler getAllPortsHandler,
      IGetPortByIdHandler getPortByIdHandler,
      ICreatePortHandler createPortHandler,
      IUpdatePortHandler updatePortHandler,
      IDeletePortHandler deletePortHandler)
    {
        _getAllPortsHandler = getAllPortsHandler;
        _getPortByIdHandler = getPortByIdHandler;
        _createPortHandler = createPortHandler;
        _updatePortHandler = updatePortHandler;
        _deletePortHandler = deletePortHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ports = await _getAllPortsHandler.HandleAsync();

        return Ok(ports);
    }


    [HttpPost]
    public async Task<IActionResult> Create(
    [FromBody] CreatePortRequestDto request)
    {
        var port = await _createPortHandler.HandleAsync(request);

        if (port is null)
        {
            return Conflict(new
            {
                message = "Port with this code already exists."
            });
        }

        return StatusCode(StatusCodes.Status201Created, port);
    }


    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var port = await _getPortByIdHandler.HandleAsync(id);

        if (port is null)
        {
            return NotFound(new
            {
                message = "Port not found."
            });
        }

        return Ok(port);
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdatePortRequestDto request)
    {
        var port = await _updatePortHandler.HandleAsync(id, request);

        if (port is null)
        {
            return NotFound(new
            {
                message = "Port not found or port code already exists."
            });
        }

        return Ok(port);
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deletePortHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Port not found."
            });
        }

        return NoContent();
    }
}