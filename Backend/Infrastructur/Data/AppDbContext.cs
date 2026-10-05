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

        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<Payment> Payments => Set<Payment>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new Configurations.InvoiceConfiguration());
            builder.ApplyConfiguration(new Configurations.PaymentConfiguration());

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

            builder.Entity<Quote>(entity =>
            {
                entity.ToTable("Quotes", "shipping");

                entity.Property(quote => quote.Price)
                    .HasPrecision(18, 2);

                entity.Property(quote => quote.Currency)
                    .HasMaxLength(3)
                    .IsRequired();

                entity.Property(quote => quote.Notes)
                    .HasMaxLength(1000);

                entity.HasOne(quote => quote.ShippingOrder)
                    .WithOne()
                    .HasForeignKey<Quote>(quote => quote.ShippingOrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}