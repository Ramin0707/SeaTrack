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

        public DbSet<Route> Routes => Set<Route>();

        public DbSet<Voyage> Voyages => Set<Voyage>();

        public DbSet<PortCall> PortCalls => Set<PortCall>();


        // =========================================================
        // Ports
        // =========================================================

        public DbSet<Port> Ports => Set<Port>();

        public DbSet<Terminal> Terminals => Set<Terminal>();

        public DbSet<Berth> Berths => Set<Berth>();

        public DbSet<Container> Containers => Set<Container>();


        // =========================================================
        // Website / CMS
        // =========================================================

        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();


        // =========================================================
        // Home Page CMS
        // =========================================================

        public DbSet<HomePageContent> HomePageContents =>
            Set<HomePageContent>();

        public DbSet<HomePageSection> HomePageSections =>
            Set<HomePageSection>();


        // =========================================================
        // Services Page CMS
        // =========================================================

        public DbSet<ServicesPageContent> ServicesPageContents =>
            Set<ServicesPageContent>();

        public DbSet<ServicesPageItem> ServicesPageItems =>
            Set<ServicesPageItem>();


        // =========================================================
        // About Page CMS
        // =========================================================

        public DbSet<AboutPageContent> AboutPageContents =>
            Set<AboutPageContent>();

        public DbSet<AboutPageSection> AboutPageSections =>
            Set<AboutPageSection>();


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

            builder.ApplyConfiguration(
                new VesselConfiguration());

            builder.ApplyConfiguration(
                new ContainerConfiguration());

            builder.ApplyConfiguration(
                new RouteConfiguration());

            builder.ApplyConfiguration(
                new VoyageConfiguration());

            builder.ApplyConfiguration(
                new PortCallConfiguration());

            builder.ApplyConfiguration(
                new ShippingOrderConfiguration());


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


            // =====================================================
            // Home Page CMS
            // =====================================================

            builder.Entity<HomePageContent>(entity =>
            {
                entity.Property(content => content.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.HasMany(content => content.Sections)
                    .WithOne(section => section.HomePageContent)
                    .HasForeignKey(section => section.HomePageContentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            // =====================================================
            // Home Page Sections
            // =====================================================

            builder.Entity<HomePageSection>(entity =>
            {
                entity.Property(section => section.SectionType)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(section => section.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(section => section.ContentJson)
                    .IsRequired();

                entity.Property(section => section.ImageUrl)
                    .HasMaxLength(1000);

                entity.HasIndex(section => new
                {
                    section.HomePageContentId,
                    section.SortOrder
                });
            });


            // =====================================================
            // Services Page CMS
            // =====================================================

            builder.Entity<ServicesPageContent>(entity =>
            {
                entity.Property(content => content.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(content => content.HeroLabel)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(content => content.HeroTitle)
                    .HasMaxLength(500)
                    .IsRequired();

                entity.Property(content => content.HeroHighlightedTitle)
                    .HasMaxLength(500)
                    .IsRequired();

                entity.Property(content => content.HeroDescription)
                    .HasMaxLength(2000)
                    .IsRequired();

                entity.Property(content => content.HeroStatsJson)
                    .IsRequired();

                entity.Property(content => content.CapabilitiesJson)
                    .IsRequired();

                entity.Property(content => content.CapabilitiesTitle)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(content => content.ScrollText)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.HasMany(content => content.Services)
                    .WithOne(service => service.ServicesPageContent)
                    .HasForeignKey(service =>
                        service.ServicesPageContentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            // =====================================================
            // Services Page Items
            // =====================================================

            builder.Entity<ServicesPageItem>(entity =>
            {
                entity.Property(service => service.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(service => service.Number)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(service => service.Label)
                    .HasMaxLength(300)
                    .IsRequired();

                entity.Property(service => service.Title)
                    .HasMaxLength(500)
                    .IsRequired();

                entity.Property(service => service.HighlightedTitle)
                    .HasMaxLength(500)
                    .IsRequired();

                entity.Property(service => service.Description)
                    .HasMaxLength(3000)
                    .IsRequired();

                entity.Property(service => service.ImageBadge)
                    .HasMaxLength(300)
                    .IsRequired();

                entity.Property(service => service.ImageUrl)
                    .HasMaxLength(1000);

                entity.Property(service => service.ImageAlt)
                    .HasMaxLength(500);

                entity.Property(service => service.BenefitsJson)
                    .IsRequired();

                entity.Property(service => service.ButtonText)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(service => service.ButtonUrl)
                    .HasMaxLength(1000)
                    .IsRequired();

                entity.HasIndex(service => new
                {
                    service.ServicesPageContentId,
                    service.SortOrder
                });
            });


            // =====================================================
            // About Page CMS
            // =====================================================

            builder.Entity<AboutPageContent>(entity =>
            {
                entity.Property(content => content.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.HasMany(content => content.Sections)
                    .WithOne(section => section.AboutPageContent)
                    .HasForeignKey(section => section.AboutPageContentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            // =====================================================
            // About Page Sections
            // =====================================================

            builder.Entity<AboutPageSection>(entity =>
            {
                entity.Property(section => section.SectionType)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(section => section.ContentJson)
                    .IsRequired();

                entity.Property(section => section.ImageUrl)
                    .HasMaxLength(1000);

                entity.HasIndex(section => new
                {
                    section.AboutPageContentId,
                    section.SortOrder
                });
            });
        }
    }
}