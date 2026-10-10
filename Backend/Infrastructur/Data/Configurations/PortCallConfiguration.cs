using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class PortCallConfiguration : IEntityTypeConfiguration<PortCall>
{
    public void Configure(EntityTypeBuilder<PortCall> builder)
    {
        builder.ToTable("PortCalls", "logistics");

        builder.HasKey(portCall => portCall.Id);

        builder.Property(portCall => portCall.EstimatedArrivalUtc)
            .IsRequired();

        builder.Property(portCall => portCall.EstimatedDepartureUtc)
            .IsRequired();

        builder.Property(portCall => portCall.IsActive)
            .IsRequired();

        builder.HasOne(portCall => portCall.Voyage)
            .WithMany()
            .HasForeignKey(portCall => portCall.VoyageId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(portCall => portCall.Port)
            .WithMany()
            .HasForeignKey(portCall => portCall.PortId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(portCall => portCall.Terminal)
            .WithMany()
            .HasForeignKey(portCall => portCall.TerminalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(portCall => portCall.Berth)
            .WithMany()
            .HasForeignKey(portCall => portCall.BerthId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}