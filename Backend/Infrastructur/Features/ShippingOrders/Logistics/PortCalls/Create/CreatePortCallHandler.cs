using Application.Features.Logistics.PortCalls.Create.DTOs;
using Application.Features.Logistics.PortCalls.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.PortCalls.Create;

public class CreatePortCallHandler : ICreatePortCallHandler
{
    private readonly AppDbContext _context;

    public CreatePortCallHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreatePortCallResponseDto?> HandleAsync(
        CreatePortCallRequestDto request)
    {
        if (request.EstimatedDepartureUtc <= request.EstimatedArrivalUtc)
            return null;

        var voyage = await _context.Voyages
            .FirstOrDefaultAsync(voyage =>
                voyage.Id == request.VoyageId &&
                voyage.IsActive);

        if (voyage is null)
            return null;

        var port = await _context.Ports
            .FirstOrDefaultAsync(port =>
                port.Id == request.PortId &&
                port.IsActive);

        if (port is null)
            return null;

        var terminal = await _context.Terminals
            .FirstOrDefaultAsync(terminal =>
                terminal.Id == request.TerminalId &&
                terminal.PortId == request.PortId &&
                terminal.IsActive);

        if (terminal is null)
            return null;

        var berth = await _context.Berths
            .FirstOrDefaultAsync(berth =>
                berth.Id == request.BerthId &&
                berth.TerminalId == request.TerminalId &&
                berth.IsActive);

        if (berth is null)
            return null;

        var berthConflict = await _context.PortCalls
            .AnyAsync(portCall =>
                portCall.BerthId == request.BerthId &&
                portCall.IsActive &&
                portCall.EstimatedArrivalUtc < request.EstimatedDepartureUtc &&
                request.EstimatedArrivalUtc < portCall.EstimatedDepartureUtc);

        if (berthConflict)
            return null;

        var portCall = new PortCall
        {
            VoyageId = request.VoyageId,
            PortId = request.PortId,
            TerminalId = request.TerminalId,
            BerthId = request.BerthId,

            EstimatedArrivalUtc = request.EstimatedArrivalUtc,
            EstimatedDepartureUtc = request.EstimatedDepartureUtc,

            ActualArrivalUtc = null,
            ActualDepartureUtc = null,

            IsActive = true
        };

        _context.PortCalls.Add(portCall);
        await _context.SaveChangesAsync();

        return new CreatePortCallResponseDto
        {
            Id = portCall.Id,

            VoyageId = portCall.VoyageId,
            VoyageNumber = voyage.VoyageNumber,

            PortId = portCall.PortId,
            PortName = port.Name,

            TerminalId = portCall.TerminalId,
            TerminalName = terminal.Name,

            BerthId = portCall.BerthId,
            BerthName = berth.Name,

            EstimatedArrivalUtc = portCall.EstimatedArrivalUtc,
            EstimatedDepartureUtc = portCall.EstimatedDepartureUtc,

            ActualArrivalUtc = portCall.ActualArrivalUtc,
            ActualDepartureUtc = portCall.ActualDepartureUtc,

            IsActive = portCall.IsActive
        };
    }
}