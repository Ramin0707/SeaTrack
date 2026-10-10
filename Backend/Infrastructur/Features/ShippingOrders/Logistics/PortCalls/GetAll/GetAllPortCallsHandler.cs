using Application.Features.Logistics.PortCalls.GetAll.DTOs;
using Application.Features.Logistics.PortCalls.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.PortCalls.GetAll;

public class GetAllPortCallsHandler : IGetAllPortCallsHandler
{
    private readonly AppDbContext _context;

    public GetAllPortCallsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllPortCallsResponseDto>> HandleAsync()
    {
        return await _context.PortCalls
            .AsNoTracking()
            .OrderBy(portCall => portCall.EstimatedArrivalUtc)
            .Select(portCall => new GetAllPortCallsResponseDto
            {
                Id = portCall.Id,

                VoyageId = portCall.VoyageId,
                VoyageNumber = portCall.Voyage.VoyageNumber,

                PortId = portCall.PortId,
                PortName = portCall.Port.Name,

                TerminalId = portCall.TerminalId,
                TerminalName = portCall.Terminal.Name,

                BerthId = portCall.BerthId,
                BerthName = portCall.Berth.Name,

                EstimatedArrivalUtc = portCall.EstimatedArrivalUtc,
                EstimatedDepartureUtc = portCall.EstimatedDepartureUtc,

                ActualArrivalUtc = portCall.ActualArrivalUtc,
                ActualDepartureUtc = portCall.ActualDepartureUtc,

                IsActive = portCall.IsActive
            })
            .ToListAsync();
    }
}