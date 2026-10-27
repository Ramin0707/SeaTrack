using System.Text.Json;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Seeding;

public class ServicesPageSeeder
{
    private readonly AppDbContext _context;

    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

    public ServicesPageSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        var servicesPage = await _context.ServicesPageContents
            .Include(page => page.Services)
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (servicesPage is null)
        {
            servicesPage = CreateServicesPage();

            _context.ServicesPageContents.Add(servicesPage);

            await _context.SaveChangesAsync();
        }

        // Если услуги уже существуют,
        // повторно начальные данные не создаём.
        if (servicesPage.Services.Any())
        {
            return;
        }

        var now = DateTime.UtcNow;

        var services = new List<ServicesPageItem>
        {
            CreateSeaFreight(
                servicesPage.Id,
                now),

            CreateContainerShipping(
                servicesPage.Id,
                now),

            CreateRouteVoyagePlanning(
                servicesPage.Id,
                now),

            CreateRealTimeTracking(
                servicesPage.Id,
                now)
        };

        _context.ServicesPageItems.AddRange(services);

        servicesPage.UpdatedAtUtc = now;

        await _context.SaveChangesAsync();
    }


    // =========================================================
    // SERVICES PAGE
    // =========================================================

    private static ServicesPageContent CreateServicesPage()
    {
        var heroStats = new[]
        {
            new
            {
                value = "120+",
                label = "Global Ports"
            },

            new
            {
                value = "35+",
                label = "Shipping Routes"
            },

            new
            {
                value = "24/7",
                label = "Cargo Visibility"
            }
        };


        var capabilities = new[]
        {
            new
            {
                number = "01",
                title = "Sea Freight"
            },

            new
            {
                number = "02",
                title = "Container Shipping"
            },

            new
            {
                number = "03",
                title = "Route & Voyage Planning"
            },

            new
            {
                number = "04",
                title = "Real-Time Tracking"
            }
        };


        return new ServicesPageContent
        {
            Name = "Services Page",

            HeroLabel = "OUR SERVICES",

            HeroTitle = "Maritime logistics",

            HeroHighlightedTitle =
                "built for global trade.",

            HeroDescription =
                "From sea freight and container shipping to route planning " +
                "and real-time tracking, SeaTrack connects every stage of " +
                "your cargo journey through one digital logistics platform.",

            HeroStatsJson =
                Serialize(heroStats),

            CapabilitiesJson =
                Serialize(capabilities),

            CapabilitiesTitle =
                "OUR CAPABILITIES",

            ScrollText =
                "Explore Services",

            CreatedAtUtc =
                DateTime.UtcNow
        };
    }


    // =========================================================
    // 01 — SEA FREIGHT
    // =========================================================

    private static ServicesPageItem CreateSeaFreight(
        int servicesPageId,
        DateTime now)
    {
        var benefits = new[]
        {
            new
            {
                number = "01",
                title = "Port-to-Port Shipping",
                description =
                    "Reliable maritime transportation between " +
                    "international ports and major trade hubs."
            },

            new
            {
                number = "02",
                title = "Flexible Cargo Solutions",
                description =
                    "Shipping solutions adapted to cargo type, " +
                    "weight, volume and required container."
            },

            new
            {
                number = "03",
                title = "Transparent Operations",
                description =
                    "Follow quotations, shipment status and logistics " +
                    "progress through one connected platform."
            }
        };


        return new ServicesPageItem
        {
            ServicesPageContentId =
                servicesPageId,

            Name =
                "Sea Freight",

            Number =
                "01",

            Label =
                "01 / SEA FREIGHT",

            Title =
                "Reliable cargo transport",

            HighlightedTitle =
                "across global waters.",

            Description =
                "SeaTrack connects your cargo with reliable maritime " +
                "routes, vessels and ports while keeping every stage " +
                "of the shipping process transparent and organized.",

            ImageBadge =
                "GLOBAL SEA FREIGHT",

            ImageUrl =
                "/uploads/cms/default/services-sea-freight.jpg",

            ImageAlt =
                "Sea freight container ship",

            BenefitsJson =
                Serialize(benefits),

            ButtonText =
                "Request a Quote",

            ButtonUrl =
                "/register",

            SortOrder =
                1,

            IsVisible =
                true,

            CreatedAtUtc =
                now
        };
    }


    // =========================================================
    // 02 — CONTAINER SHIPPING
    // =========================================================

    private static ServicesPageItem CreateContainerShipping(
        int servicesPageId,
        DateTime now)
    {
        var benefits = new[]
        {
            new
            {
                number = "01",
                title = "Container Selection",
                description =
                    "Choose the appropriate container type based on " +
                    "cargo weight, volume and transportation requirements."
            },

            new
            {
                number = "02",
                title = "Smart Assignment",
                description =
                    "Containers are assigned to confirmed shipping " +
                    "orders and connected with the appropriate voyage."
            },

            new
            {
                number = "03",
                title = "Capacity Management",
                description =
                    "Keep container availability, status and cargo " +
                    "capacity organized throughout maritime operations."
            }
        };


        return new ServicesPageItem
        {
            ServicesPageContentId =
                servicesPageId,

            Name =
                "Container Shipping",

            Number =
                "02",

            Label =
                "02 / CONTAINER SHIPPING",

            Title =
                "The right container",

            HighlightedTitle =
                "for every cargo.",

            Description =
                "SeaTrack simplifies container planning and assignment, " +
                "helping your cargo move efficiently from port to port " +
                "with the right equipment for every shipment.",

            ImageBadge =
                "CONTAINER OPERATIONS",

            ImageUrl =
                "/uploads/cms/default/services-container-shipping.jpg",

            ImageAlt =
                "Container shipping terminal",

            BenefitsJson =
                Serialize(benefits),

            ButtonText =
                "Start Shipping",

            ButtonUrl =
                "/register",

            SortOrder =
                2,

            IsVisible =
                true,

            CreatedAtUtc =
                now
        };
    }


    // =========================================================
    // 03 — ROUTE & VOYAGE PLANNING
    // =========================================================

    private static ServicesPageItem CreateRouteVoyagePlanning(
        int servicesPageId,
        DateTime now)
    {
        var benefits = new[]
        {
            new
            {
                number = "01",
                title = "Optimized Shipping Routes",
                description =
                    "Plan maritime routes between origin and destination " +
                    "ports using organized voyage information."
            },

            new
            {
                number = "02",
                title = "Vessel & Voyage Coordination",
                description =
                    "Connect vessels, routes and voyage schedules with " +
                    "confirmed cargo shipments."
            },

            new
            {
                number = "03",
                title = "Port Call Planning",
                description =
                    "Coordinate terminals, berths, arrival times and " +
                    "departure schedules throughout the voyage."
            }
        };


        return new ServicesPageItem
        {
            ServicesPageContentId =
                servicesPageId,

            Name =
                "Route & Voyage Planning",

            Number =
                "03",

            Label =
                "03 / ROUTE & VOYAGE PLANNING",

            Title =
                "Smarter routes for",

            HighlightedTitle =
                "every voyage.",

            Description =
                "SeaTrack connects ports, vessels and shipping routes " +
                "to help organize every voyage from departure to arrival " +
                "through one coordinated maritime logistics platform.",

            ImageBadge =
                "ROUTE & VOYAGE PLANNING",

            ImageUrl =
                "/uploads/cms/default/services-route-voyage.jpg",

            ImageAlt =
                "Maritime route and voyage planning",

            BenefitsJson =
                Serialize(benefits),

            ButtonText =
                "Plan Your Shipment",

            ButtonUrl =
                "/register",

            SortOrder =
                3,

            IsVisible =
                true,

            CreatedAtUtc =
                now
        };
    }


    // =========================================================
    // 04 — REAL-TIME TRACKING
    // =========================================================

    private static ServicesPageItem CreateRealTimeTracking(
        int servicesPageId,
        DateTime now)
    {
        var benefits = new[]
        {
            new
            {
                number = "01",
                title = "Live Shipment Status",
                description =
                    "Check the current status of your shipment using " +
                    "a unique SeaTrack tracking number."
            },

            new
            {
                number = "02",
                title = "Complete Cargo Timeline",
                description =
                    "Follow every logistics stage including loaded, " +
                    "departed, in transit, arrived, unloaded and delivered."
            },

            new
            {
                number = "03",
                title = "Transparent Journey",
                description =
                    "View shipment progress, origin and destination " +
                    "information through one connected tracking platform."
            }
        };


        return new ServicesPageItem
        {
            ServicesPageContentId =
                servicesPageId,

            Name =
                "Real-Time Tracking",

            Number =
                "04",

            Label =
                "04 / REAL-TIME TRACKING",

            Title =
                "Your shipment.",

            HighlightedTitle =
                "Always in sight.",

            Description =
                "SeaTrack gives customers clear visibility into every stage " +
                "of the maritime journey, from cargo preparation and departure " +
                "to arrival and final delivery.",

            ImageBadge =
                "REAL-TIME TRACKING",

            ImageUrl =
                "/uploads/cms/default/services-real-time-tracking.jpg",

            ImageAlt =
                "Real-time maritime shipment tracking",

            BenefitsJson =
                Serialize(benefits),

            ButtonText =
                "Track Shipment",

            ButtonUrl =
                "/tracking",

            SortOrder =
                4,

            IsVisible =
                true,

            CreatedAtUtc =
                now
        };
    }


    // =========================================================
    // JSON
    // =========================================================

    private static string Serialize(object value)
    {
        return JsonSerializer.Serialize(
            value,
            JsonOptions);
    }
}