using Application.Features.Logistics.Containers.Create.DTOs;
using Application.Features.Logistics.Containers.Create.Interfaces;
using Application.Features.Logistics.Containers.Delete.Interfaces;
using Application.Features.Logistics.Containers.GetAll.Interfaces;
using Application.Features.Logistics.Containers.GetById.Interfaces;
using Application.Features.Logistics.Containers.Update.DTOs;
using Application.Features.Logistics.Containers.Update.Interfaces;
using Infrastructur.Features.Logistics.Containers.Delete;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/containers")]
[Authorize(Roles = "Admin,Operator")]
public class ContainersController : ControllerBase
{
    private readonly ICreateContainerHandler _createContainerHandler;
    private readonly IGetAllContainersHandler _getAllContainersHandler;
    private readonly IGetContainerByIdHandler _getContainerByIdHandler;
    private readonly IUpdateContainerHandler _updateContainerHandler;
    private readonly IDeleteContainerHandler _deleteContainerHandler;


    public ContainersController(
     IDeleteContainerHandler deleteContainerHandler,
     ICreateContainerHandler createContainerHandler,
     IGetAllContainersHandler getAllContainersHandler,
     IGetContainerByIdHandler getContainerByIdHandler,
     IUpdateContainerHandler updateContainerHandler)
    {
        _createContainerHandler = createContainerHandler;
        _getAllContainersHandler = getAllContainersHandler;
        _getContainerByIdHandler = getContainerByIdHandler;
        _updateContainerHandler = updateContainerHandler;
        _deleteContainerHandler = deleteContainerHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateContainerRequestDto request)
    {
        var container = await _createContainerHandler.HandleAsync(request);

        if (container is null)
        {
            return Conflict(new
            {
                message = "Container with this container number already exists."
            });
        }

        return StatusCode(StatusCodes.Status201Created, container);
    }




    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var containers = await _getAllContainersHandler.HandleAsync();

        return Ok(containers);
    }


    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var container = await _getContainerByIdHandler.HandleAsync(id);

        if (container is null)
        {
            return NotFound(new
            {
                message = "Container not found."
            });
        }


        return Ok(container);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateContainerRequestDto request)
    {
        var container = await _updateContainerHandler.HandleAsync(id, request);

        if (container is null)
        {
            return BadRequest(new
            {
                message = "Container not found or container number already exists."
            });
        }

        return Ok(container);
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _deleteContainerHandler.HandleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Container not found."
            });
        }

        return NoContent();
    }

}