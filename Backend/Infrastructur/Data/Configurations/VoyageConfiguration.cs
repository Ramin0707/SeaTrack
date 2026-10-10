using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class VoyageConfiguration : IEntityTypeConfiguration<Voyage>
{
    public void Configure(EntityTypeBuilder<Voyage> builder)
    {
        builder.ToTable("Voyages", "logistics");

        builder.HasKey(voyage => voyage.Id);

        builder.Property(voyage => voyage.VoyageNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(voyage => voyage.VoyageNumber)
            .IsUnique();

        builder.Property(voyage => voyage.EstimatedDepartureUtc)
            .IsRequired();

        builder.Property(voyage => voyage.EstimatedArrivalUtc)
            .IsRequired();

        builder.Property(voyage => voyage.IsActive)
            .IsRequired();

        builder.HasOne(voyage => voyage.Vessel)
            .WithMany()
            .HasForeignKey(voyage => voyage.VesselId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(voyage => voyage.Route)
            .WithMany()
            .HasForeignKey(voyage => voyage.RouteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}