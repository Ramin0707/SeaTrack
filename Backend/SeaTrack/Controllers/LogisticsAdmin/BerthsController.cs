using Application.Features.Logistics.Berths.Create.DTOs;
using Application.Features.Logistics.Berths.Create.Interfaces;
using Application.Features.Logistics.Berths.Delete.Interfaces;
using Application.Features.Logistics.Berths.GetAll.Interfaces;
using Application.Features.Logistics.Berths.GetById.Interfaces;
using Application.Features.Logistics.Berths.Update.DTOs;
using Application.Features.Logistics.Berths.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/berths")]
[Authorize(Roles = "Admin,Operator")]
public class BerthsController : ControllerBase
{
    private readonly ICreateBerthHandler _createBerthHandler;
    private readonly IGetAllBerthsHandler _getAllBerthsHandler;
    private readonly IGetBerthByIdHandler _getBerthByIdHandler;
    private readonly IUpdateBerthHandler _updateBerthHandler;
    private readonly IDeleteBerthHandler _deleteBerthHandler;
    public BerthsController(
    ICreateBerthHandler createBerthHandler,
    IGetAllBerthsHandler getAllBerthsHandler,
    IGetBerthByIdHandler getBerthByIdHandler,
    IUpdateBerthHandler updateBerthHandler,
    IDeleteBerthHandler deleteBerthHandler)
    {
        _createBerthHandler = createBerthHandler;
        _getAllBerthsHandler = getAllBerthsHandler;
        _getBerthByIdHandler = getBerthByIdHandler;
        _updateBerthHandler = updateBerthHandler;
        _deleteBerthHandler = deleteBerthHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateBerthRequestDto request)
    {
        var berth = await _createBerthHandler.HandleAsync(request);

        if (berth is null)
        {
            return Conflict(new
            {
                message = "Terminal not found or berth code already exists."
            });
        }

        return CreatedAtAction(
            nameof(Create),
            new { id = berth.Id },
            berth);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var berths = await _getAllBerthsHandler.HandleAsync();

        return Ok(berths);
    }





    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var berth = await _getBerthByIdHandler.HandleAsync(id);

        if (berth is null)
        {
            return NotFound(new
            {
                message = "Berth not found."
            });
        }

        return Ok(berth);
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
    int id,
    [FromBody] UpdateBerthRequestDto request)
    {
        var berth = await _updateBerthHandler.HandleAsync(id, request);

        if (berth is null)
        {
            return BadRequest(new
            {
                message = "Berth not found, terminal not found, or berth code already exists."
            });
        }

        return Ok(berth);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deleteBerthHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Berth not found."
            });
        }

        return NoContent();
    }
}