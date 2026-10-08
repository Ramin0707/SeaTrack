using Application.Features.Logistics.Ports.Create.DTOs;
using Application.Features.Logistics.Ports.Create.Interfaces;
using Application.Features.Logistics.Ports.GetAll.DTOs;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Ports.Create;

public class CreatePortHandler : ICreatePortHandler
{
    private readonly AppDbContext _context;

    public CreatePortHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PortDto?> HandleAsync(CreatePortRequestDto request)
    {
        var normalizedCode = request.Code.Trim().ToUpperInvariant();

        var exists = await _context.Ports
            .AnyAsync(port => port.Code == normalizedCode);

        if (exists)
            return null;

        var port = new Port
        {
            Name = request.Name.Trim(),
            Code = normalizedCode,
            Country = request.Country.Trim(),
            City = request.City.Trim(),
            IsActive = true
        };

        _context.Ports.Add(port);

        await _context.SaveChangesAsync();

        return new PortDto
        {
            Id = port.Id,
            Name = port.Name,
            Code = port.Code,
            Country = port.Country,
            City = port.City,
            IsActive = port.IsActive
        };
    }
}