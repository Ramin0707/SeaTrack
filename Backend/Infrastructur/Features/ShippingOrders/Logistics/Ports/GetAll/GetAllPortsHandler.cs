using Application.Features.Logistics.Ports.GetAll.DTOs;
using Application.Features.Logistics.Ports.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Ports.GetAll;

public class GetAllPortsHandler : IGetAllPortsHandler
{
    private readonly AppDbContext _context;

    public GetAllPortsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PortDto>> HandleAsync()
    {
        return await _context.Ports
            .AsNoTracking()
            .OrderBy(port => port.Name)
            .Select(port => new PortDto
            {
                Id = port.Id,
                Name = port.Name,
                Code = port.Code,
                Country = port.Country,
                City = port.City,
                IsActive = port.IsActive
            })
            .ToListAsync();
    }
}