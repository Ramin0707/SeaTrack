using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructur.Data.Configurations;

public class TerminalConfiguration : IEntityTypeConfiguration<Terminal>
{
    public void Configure(EntityTypeBuilder<Terminal> builder)
    {
        builder.ToTable("Terminals", "logistics");

        builder.HasKey(terminal => terminal.Id);

        builder.Property(terminal => terminal.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(terminal => terminal.Code)
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(terminal => terminal.Code)
            .IsUnique();

        builder.HasOne(terminal => terminal.Port)
            .WithMany(port => port.Terminals)
            .HasForeignKey(terminal => terminal.PortId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}