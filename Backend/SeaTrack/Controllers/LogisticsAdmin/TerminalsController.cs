using Application.Features.Logistics.Terminals.Create.DTOs;
using Application.Features.Logistics.Terminals.Create.Interfaces;
using Application.Features.Logistics.Terminals.Delete.Interfaces;
using Application.Features.Logistics.Terminals.GetAll.Interfaces;
using Application.Features.Logistics.Terminals.GetById.Interfaces;
using Application.Features.Logistics.Terminals.Update.DTOs;
using Application.Features.Logistics.Terminals.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/terminals")]
[Authorize(Roles = "Admin,Operator")]
public class TerminalsController : ControllerBase
{
    private readonly ICreateTerminalHandler _createTerminalHandler;
    private readonly IGetAllTerminalsHandler _getAllTerminalsHandler;
    private readonly IGetTerminalByIdHandler _getTerminalByIdHandler;
    private readonly IUpdateTerminalHandler _updateTerminalHandler;
    private readonly IDeleteTerminalHandler _deleteTerminalHandler;

    public TerminalsController(
      ICreateTerminalHandler createTerminalHandler,
      IGetAllTerminalsHandler getAllTerminalsHandler,
      IGetTerminalByIdHandler getTerminalByIdHandler,
      IUpdateTerminalHandler updateTerminalHandler,
      IDeleteTerminalHandler deleteTerminalHandler)
    {
        _createTerminalHandler = createTerminalHandler;
        _getAllTerminalsHandler = getAllTerminalsHandler;
        _getTerminalByIdHandler = getTerminalByIdHandler;
        _updateTerminalHandler = updateTerminalHandler;
        _deleteTerminalHandler = deleteTerminalHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateTerminalRequestDto request)
    {
        var terminal = await _createTerminalHandler.HandleAsync(request);

        if (terminal is null)
        {
            return BadRequest(new
            {
                message = "Port not found or terminal code already exists."
            });
        }

        return StatusCode(
            StatusCodes.Status201Created,
            terminal);
    }


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var terminals = await _getAllTerminalsHandler.HandleAsync();

        return Ok(terminals);
    }



    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var terminal = await _getTerminalByIdHandler.HandleAsync(id);

        if (terminal is null)
        {
            return NotFound(new
            {
                message = "Terminal not found."
            });
        }

        return Ok(terminal);
    }



    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdateTerminalRequestDto request)
    {
        var terminal = await _updateTerminalHandler.HandleAsync(id, request);

        if (terminal is null)
        {
            return BadRequest(new
            {
                message = "Terminal not found, port not found, or terminal code already exists."
            });
        }

        return Ok(terminal);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deleteTerminalHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Terminal not found."
            });
        }

        return NoContent();
    }
}