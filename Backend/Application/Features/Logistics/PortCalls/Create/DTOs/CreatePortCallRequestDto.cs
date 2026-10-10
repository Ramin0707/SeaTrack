namespace Application.Features.Logistics.PortCalls.Create.DTOs;

public class CreatePortCallRequestDto
{
    public int VoyageId { get; set; }

    public int PortId { get; set; }

    public int TerminalId { get; set; }

    public int BerthId { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }
}