using Domain.Entities;
using Infrastructur.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<ShippingOrder> ShippingOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasDefaultSchema("identity");

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(user => user.FullName)
                    .HasMaxLength(200)
                    .IsRequired();
            });

            builder.Entity<ShippingOrder>(entity =>
            {
                entity.ToTable("ShippingOrders", "shipping");
                entity.Property(order => order.Weight)
                 .HasPrecision(18, 2);

                entity.Property(order => order.Volume)
                    .HasPrecision(18, 2);
            });
        }
    }
}