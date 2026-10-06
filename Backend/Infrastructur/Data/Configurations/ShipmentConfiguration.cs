using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class ShipmentConfiguration : IEntityTypeConfiguration<Shipment>
{
    public void Configure(EntityTypeBuilder<Shipment> builder)
    {
        builder.ToTable("Shipments", "shipping");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TrackingNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.TrackingNumber)
            .IsUnique();

        builder.Property(x => x.Status)
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.HasOne(x => x.ShippingOrder)
            .WithMany()
            .HasForeignKey(x => x.ShippingOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.ShippingOrderId)
            .IsUnique();
    }
}