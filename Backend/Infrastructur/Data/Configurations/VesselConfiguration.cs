using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class VesselConfiguration : IEntityTypeConfiguration<Vessel>
{
    public void Configure(EntityTypeBuilder<Vessel> builder)
    {
        builder.ToTable("Vessels", "logistics");

        builder.HasKey(vessel => vessel.Id);

        builder.Property(vessel => vessel.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(vessel => vessel.ImoNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(vessel => vessel.ImoNumber)
            .IsUnique();

        builder.Property(vessel => vessel.CallSign)
            .HasMaxLength(50);

        builder.Property(vessel => vessel.Flag)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(vessel => vessel.Length)
            .HasPrecision(10, 2);

        builder.Property(vessel => vessel.Width)
            .HasPrecision(10, 2);

        builder.Property(vessel => vessel.MaxDraft)
            .HasPrecision(10, 2);

        builder.Property(vessel => vessel.DeadweightTonnage)
            .HasPrecision(18, 2);
    }
}