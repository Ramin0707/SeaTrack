using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class PortConfiguration : IEntityTypeConfiguration<Port>
{
    public void Configure(EntityTypeBuilder<Port> builder)
    {
        builder.ToTable("Ports", "logistics");

        builder.HasKey(port => port.Id);

        builder.Property(port => port.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(port => port.Code)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(port => port.Country)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(port => port.City)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(port => port.Code)
            .IsUnique();

        builder.HasMany(port => port.Terminals)
            .WithOne(terminal => terminal.Port)
            .HasForeignKey(terminal => terminal.PortId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}