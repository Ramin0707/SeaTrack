using Domain.Entities;
using Infrastructur.Data.Configurations;
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

        // =========================================================
        // Shipping
        // =========================================================

        public DbSet<ShippingOrder> ShippingOrders { get; set; }

        public DbSet<Quote> Quotes { get; set; }

        public DbSet<Invoice> Invoices => Set<Invoice>();

        public DbSet<Payment> Payments => Set<Payment>();

        public DbSet<Shipment> Shipments => Set<Shipment>();
        public DbSet<Vessel> Vessels => Set<Vessel>();


        // =========================================================
        // Ports
        // =========================================================

        public DbSet<Port> Ports => Set<Port>();

        public DbSet<Terminal> Terminals => Set<Terminal>();

        public DbSet<Berth> Berths => Set<Berth>();

        public DbSet<Container> Containers => Set<Container>();
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // =====================================================
            // Configurations
            // =====================================================

            builder.ApplyConfiguration(
                new Configurations.InvoiceConfiguration());

            builder.ApplyConfiguration(
                new Configurations.PaymentConfiguration());
            builder.ApplyConfiguration(
                 new Configurations.PortConfiguration());

            builder.ApplyConfiguration(
                new Configurations.TerminalConfiguration());

            builder.ApplyConfiguration(
                new Configurations.BerthConfiguration());

            builder.ApplyConfiguration(new VesselConfiguration());
            builder.ApplyConfiguration(new ContainerConfiguration());

            // =====================================================
            // Default Schema
            // =====================================================

            builder.HasDefaultSchema("identity");


            // =====================================================
            // Identity
            // =====================================================

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(user => user.FullName)
                    .HasMaxLength(200)
                    .IsRequired();
            });


            // =====================================================
            // Shipping Order
            // =====================================================

            builder.Entity<ShippingOrder>(entity =>
            {
                entity.ToTable("ShippingOrders", "shipping");

                entity.Property(order => order.Weight)
                    .HasPrecision(18, 2);

                entity.Property(order => order.Volume)
                    .HasPrecision(18, 2);
            });


            // =====================================================
            // Quote
            // =====================================================

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
                    .HasForeignKey<Quote>(
                        quote => quote.ShippingOrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}