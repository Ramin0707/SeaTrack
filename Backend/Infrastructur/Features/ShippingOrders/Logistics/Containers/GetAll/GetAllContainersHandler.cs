using Application.Features.Logistics.Containers.GetAll.DTOs;
using Application.Features.Logistics.Containers.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Containers.GetAll;

public class GetAllContainersHandler : IGetAllContainersHandler
{
    private readonly AppDbContext _context;

    public GetAllContainersHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllContainersResponseDto>> HandleAsync()
    {
        return await _context.Containers
            .AsNoTracking()
            .OrderBy(container => container.ContainerNumber)
            .Select(container => new GetAllContainersResponseDto
            {
                Id = container.Id,
                ContainerNumber = container.ContainerNumber,
                ContainerType = container.ContainerType,
                MaxWeight = container.MaxWeight,
                MaxVolume = container.MaxVolume,
                Status = container.Status,
                IsActive = container.IsActive
            })
            .ToListAsync();
    }
}