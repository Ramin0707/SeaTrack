using Application.Features.Logistics.PortCalls.Create.DTOs;
using Application.Features.Logistics.PortCalls.Create.Interfaces;
using Application.Features.Logistics.PortCalls.Delete.Interfaces;
using Application.Features.Logistics.PortCalls.GetAll.Interfaces;
using Application.Features.Logistics.PortCalls.GetById.Interfaces;
using Application.Features.Logistics.PortCalls.Update.DTOs;
using Application.Features.Logistics.PortCalls.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/port-calls")]
[Authorize(Roles = "Admin,Operator")]
public class PortCallsController : ControllerBase
{
    private readonly ICreatePortCallHandler _createPortCallHandler;
    private readonly IGetAllPortCallsHandler _getAllPortCallsHandler;
    private readonly IGetPortCallByIdHandler _getPortCallByIdHandler;
    private readonly IUpdatePortCallHandler _updatePortCallHandler;
    private readonly IDeletePortCallHandler _deletePortCallHandler;
    public PortCallsController(
     ICreatePortCallHandler createPortCallHandler,
     IGetAllPortCallsHandler getAllPortCallsHandler,
     IGetPortCallByIdHandler getPortCallByIdHandler,
     IUpdatePortCallHandler updatePortCallHandler,
     IDeletePortCallHandler deletePortCallHandler)
    {
        _createPortCallHandler = createPortCallHandler;
        _getAllPortCallsHandler = getAllPortCallsHandler;
        _getPortCallByIdHandler = getPortCallByIdHandler;
        _updatePortCallHandler = updatePortCallHandler;
        _deletePortCallHandler = deletePortCallHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreatePortCallRequestDto request)
    {
        var portCall = await _createPortCallHandler.HandleAsync(request);

        if (portCall is null)
        {
            return BadRequest(new
            {
                message = "Port call could not be created. Check voyage, port, terminal, berth, dates or berth availability."
            });
        }

        return StatusCode(
            StatusCodes.Status201Created,
            portCall);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var portCalls = await _getAllPortCallsHandler.HandleAsync();

        return Ok(portCalls);
    }



    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var portCall = await _getPortCallByIdHandler.HandleAsync(id);

        if (portCall is null)
        {
            return NotFound(new
            {
                message = "Port call not found."
            });
        }

        return Ok(portCall);
    }



    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdatePortCallRequestDto request)
    {
        var portCall = await _updatePortCallHandler.HandleAsync(id, request);

        if (portCall is null)
        {
            return BadRequest(new
            {
                message = "Port call could not be updated. Check voyage, port, terminal, berth, dates or berth availability."
            });
        }

        return Ok(portCall);
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deletePortCallHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Port call not found."
            });
        }

        return NoContent();
    }
}