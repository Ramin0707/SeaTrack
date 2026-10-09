using Domain.Enums;

namespace Domain.Entities;

public class Container : BaseEntity
{
    public string ContainerNumber { get; set; } = string.Empty;

    public ContainerType ContainerType { get; set; }

    public decimal MaxWeight { get; set; }

    public decimal MaxVolume { get; set; }

    public ContainerStatus Status { get; set; } = ContainerStatus.Available;

    public bool IsActive { get; set; } = true;
}