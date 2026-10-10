using Application.Features.Logistics.Voyages.Create.DTOs;
using Application.Features.Logistics.Voyages.Create.Interfaces;
using Application.Features.Logistics.Voyages.Delete.Interfaces;
using Application.Features.Logistics.Voyages.GetAll.Interfaces;
using Application.Features.Logistics.Voyages.GetById.Interfaces;
using Application.Features.Logistics.Voyages.Update.DTOs;
using Application.Features.Logistics.Voyages.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/voyages")]
[Authorize(Roles = "Admin,Operator")]
public class VoyagesController : ControllerBase
{
    private readonly ICreateVoyageHandler _createVoyageHandler;
    private readonly IGetAllVoyagesHandler _getAllVoyagesHandler;
    private readonly IGetVoyageByIdHandler _getVoyageByIdHandler;
    private readonly IUpdateVoyageHandler _updateVoyageHandler;
    private readonly IDeleteVoyageHandler _deleteVoyageHandler;
    public VoyagesController(
     ICreateVoyageHandler createVoyageHandler,
     IGetAllVoyagesHandler getAllVoyagesHandler,
     IGetVoyageByIdHandler getVoyageByIdHandler,
     IUpdateVoyageHandler updateVoyageHandler,
     IDeleteVoyageHandler deleteVoyageHandler)
    {
        _createVoyageHandler = createVoyageHandler;
        _getAllVoyagesHandler = getAllVoyagesHandler;
        _getVoyageByIdHandler = getVoyageByIdHandler;
        _updateVoyageHandler = updateVoyageHandler;
        _deleteVoyageHandler = deleteVoyageHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateVoyageRequestDto request)
    {
        var voyage = await _createVoyageHandler.HandleAsync(request);

        if (voyage is null)
        {
            return BadRequest(new
            {
                message = "Voyage could not be created. Check vessel, route, voyage number and departure/arrival dates."
            });
        }

        return StatusCode(StatusCodes.Status201Created, voyage);
    }



    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var voyages = await _getAllVoyagesHandler.HandleAsync();

        return Ok(voyages);
    }



    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var voyage = await _getVoyageByIdHandler.HandleAsync(id);

        if (voyage is null)
        {
            return NotFound(new
            {
                message = "Voyage not found."
            });
        }

        return Ok(voyage);
    }



    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdateVoyageRequestDto request)
    {
        var voyage = await _updateVoyageHandler.HandleAsync(id, request);

        if (voyage is null)
        {
            return BadRequest(new
            {
                message = "Voyage could not be updated. Check voyage, vessel, route, voyage number and departure/arrival dates."
            });
        }

        return Ok(voyage);
    }



    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deleteVoyageHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Voyage not found."
            });
        }

        return NoContent();
    }
}