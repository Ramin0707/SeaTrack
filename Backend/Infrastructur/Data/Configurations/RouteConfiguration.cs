using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class RouteConfiguration : IEntityTypeConfiguration<Route>
{
    public void Configure(EntityTypeBuilder<Route> builder)
    {
        builder.ToTable("Routes", "logistics");

        builder.HasKey(route => route.Id);

        builder.Property(route => route.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(route => route.Code)
            .HasMaxLength(30)
            .IsRequired();

        builder.HasIndex(route => route.Code)
            .IsUnique();

        builder.Property(route => route.DistanceNauticalMiles)
            .HasPrecision(10, 2);

        builder.Property(route => route.EstimatedTransitDays)
            .IsRequired();

        builder.HasOne(route => route.OriginPort)
            .WithMany()
            .HasForeignKey(route => route.OriginPortId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(route => route.DestinationPort)
            .WithMany()
            .HasForeignKey(route => route.DestinationPortId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}