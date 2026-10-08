using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class BerthConfiguration : IEntityTypeConfiguration<Berth>
{
    public void Configure(EntityTypeBuilder<Berth> builder)
    {
        builder.ToTable("Berths", "logistics");

        builder.HasKey(berth => berth.Id);

        builder.Property(berth => berth.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(berth => berth.Code)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(berth => berth.MaxDepth)
            .HasPrecision(10, 2);

        builder.Property(berth => berth.MaxVesselLength)
            .HasPrecision(10, 2);

        builder.HasIndex(berth => berth.Code)
            .IsUnique();

        builder.HasOne(berth => berth.Terminal)
            .WithMany(terminal => terminal.Berths)
            .HasForeignKey(berth => berth.TerminalId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}