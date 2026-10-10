using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class ShippingOrderConfiguration : IEntityTypeConfiguration<ShippingOrder>
{
    public void Configure(EntityTypeBuilder<ShippingOrder> builder)
    {
        builder.HasOne(order => order.Container)
            .WithMany()
            .HasForeignKey(order => order.ContainerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(order => order.Voyage)
            .WithMany()
            .HasForeignKey(order => order.VoyageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}