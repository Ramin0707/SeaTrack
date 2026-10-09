using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class ContainerConfiguration : IEntityTypeConfiguration<Container>
{
    public void Configure(EntityTypeBuilder<Container> builder)
    {
        builder.ToTable("Containers", "logistics");

        builder.HasKey(container => container.Id);

        builder.Property(container => container.ContainerNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(container => container.ContainerNumber)
            .IsUnique();

        builder.Property(container => container.ContainerType)
            .IsRequired();

        builder.Property(container => container.MaxWeight)
            .HasPrecision(18, 2);

        builder.Property(container => container.MaxVolume)
            .HasPrecision(18, 2);

        builder.Property(container => container.Status)
            .IsRequired();

        builder.Property(container => container.IsActive)
            .IsRequired();
    }
}