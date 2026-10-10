namespace Domain.Entities;

public class PortCall : BaseEntity
{
    public int VoyageId { get; set; }

    public int PortId { get; set; }

    public int TerminalId { get; set; }

    public int BerthId { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }

    public bool IsActive { get; set; } = true;

    public Voyage Voyage { get; set; } = null!;

    public Port Port { get; set; } = null!;

    public Terminal Terminal { get; set; } = null!;

    public Berth Berth { get; set; } = null!;
}