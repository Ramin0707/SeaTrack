using Application.Features.Logistics.Vessels.Create.DTOs;
using Application.Features.Logistics.Vessels.Create.Interfaces;
using Application.Features.Logistics.Vessels.Delete.Interfaces;
using Application.Features.Logistics.Vessels.GetAll.Interfaces;
using Application.Features.Logistics.Vessels.GetById.Interfaces;
using Application.Features.Logistics.Vessels.Update.DTOs;
using Application.Features.Logistics.Vessels.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/vessels")]
[Authorize(Roles = "Admin,Operator")]
public class VesselsController : ControllerBase
{
    private readonly ICreateVesselHandler _createVesselHandler;
    private readonly IGetAllVesselsHandler _getAllVesselsHandler;
    private readonly IGetVesselByIdHandler _getVesselByIdHandler;
    private readonly IUpdateVesselHandler _updateVesselHandler;
    private readonly IDeleteVesselHandler _deleteVesselHandler;
    public VesselsController(
        ICreateVesselHandler createVesselHandler,
        IGetAllVesselsHandler getAllVesselsHandler,
        IGetVesselByIdHandler getVesselByIdHandler,
        IUpdateVesselHandler updateVesselHandler,
        IDeleteVesselHandler deleteVesselHandler)
    {
        _createVesselHandler = createVesselHandler;
        _getAllVesselsHandler = getAllVesselsHandler;
        _getVesselByIdHandler = getVesselByIdHandler;
        _updateVesselHandler = updateVesselHandler;
        _deleteVesselHandler = deleteVesselHandler;
    }
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateVesselRequestDto request)
    {
        var vessel = await _createVesselHandler.HandleAsync(request);

        if (vessel is null)
        {
            return Conflict(new
            {
                message = "Vessel with this IMO number already exists."
            });
        }

        return CreatedAtAction(
            nameof(Create),
            new { id = vessel.Id },
            vessel);
    }



    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vessels = await _getAllVesselsHandler.HandleAsync();

        return Ok(vessels);
    }




    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vessel = await _getVesselByIdHandler.HandleAsync(id);

        if (vessel is null)
        {
            return NotFound(new
            {
                message = "Vessel not found."
            });
        }

        return Ok(vessel);
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdateVesselRequestDto request)
    {
        var vessel = await _updateVesselHandler.HandleAsync(id, request);

        if (vessel is null)
        {
            return BadRequest(new
            {
                message = "Vessel not found or IMO number already exists."
            });
        }

        return Ok(vessel);
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deleteVesselHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Vessel not found."
            });
        }

        return NoContent();
    }


}