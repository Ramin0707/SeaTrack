using System.Text.Json;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Seeding;

public class HomePageSeeder
{
    private readonly AppDbContext _context;

    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

    public HomePageSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        var homePage = await _context.HomePageContents
            .Include(page => page.Sections)
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (homePage is null)
        {
            homePage = new HomePageContent
            {
                Name = "Home Page",
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.HomePageContents.Add(homePage);

            await _context.SaveChangesAsync();
        }

        // Если Home Page уже содержит секции,
        // повторно начальные секции не создаём.
        if (homePage.Sections.Any())
        {
            return;
        }

        var now = DateTime.UtcNow;

        var sections = new List<HomePageSection>
        {
            CreateHeroSection(
                homePage.Id,
                now),

            CreateServicesSection(
                homePage.Id,
                now),

            CreateGlobalNetworkSection(
                homePage.Id,
                now),

            CreateTrackingSection(
                homePage.Id,
                now),

            CreateDestinationsSection(
                homePage.Id,
                now),

            CreateWhySeaTrackSection(
                homePage.Id,
                now),

            CreateCallToActionSection(
                homePage.Id,
                now)
        };

        _context.HomePageSections.AddRange(sections);

        homePage.UpdatedAtUtc = now;

        await _context.SaveChangesAsync();
    }

    private static HomePageSection CreateHeroSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "GLOBAL MARITIME LOGISTICS",

            title = "Connecting cargo.",

            highlightedTitle = "Moving the world.",

            description =
                "Manage your sea freight from quotation to final delivery. " +
                "Track shipments, containers and voyages through one powerful " +
                "maritime logistics platform.",

            primaryButtonText = "Start Shipping",
            primaryButtonUrl = "/register",

            secondaryButtonText = "Track Shipment",
            secondaryButtonUrl = "/tracking",

            stats = new[]
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
                    label = "Shipment Tracking"
                }
            },

            demoShipment = new
            {
                label = "LIVE SHIPMENT",
                route = "Baku → Aktau",
                voyage = "Voyage ST-2026-001",
                origin = "Baku",
                destination = "Aktau",
                status = "In Transit"
            }
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "Hero",
            Name = "Hero",
            SortOrder = 1,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl =
                "/uploads/cms/default/hero-port.jpg",
            CreatedAtUtc = now
        };
    }

    private static HomePageSection CreateServicesSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "OUR SERVICES",

            title = "End-to-End Logistics",

            highlightedTitle = "for Global Trade",

            description =
                "From quotation to final delivery, SeaTrack brings your " +
                "maritime logistics operations together in one powerful platform.",

            services = new[]
            {
                new
                {
                    number = "01",
                    title = "Sea Freight",
                    text =
                        "Reliable international maritime cargo transportation " +
                        "with transparent management from port to port.",
                    linkText = "Explore service",
                    linkUrl = "#",
                    iconType = "SeaFreight"
                },

                new
                {
                    number = "02",
                    title = "Container Shipping",
                    text =
                        "Container planning and assignment with efficient cargo " +
                        "capacity management throughout the voyage.",
                    linkText = "Explore service",
                    linkUrl = "#",
                    iconType = "Container"
                },

                new
                {
                    number = "03",
                    title = "Real-Time Tracking",
                    text =
                        "Track shipment status, voyage progress and port calls " +
                        "with your unique SeaTrack tracking number.",
                    linkText = "Track shipment",
                    linkUrl = "/tracking",
                    iconType = "Tracking"
                }
            }
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "Services",
            Name = "Services",
            SortOrder = 2,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl = null,
            CreatedAtUtc = now
        };
    }

    private static HomePageSection CreateGlobalNetworkSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "OUR GLOBAL NETWORK",

            title = "Connecting ports",

            highlightedTitle = "across the world.",

            description =
                "SeaTrack connects major maritime routes, ports and logistics " +
                "operations through one powerful platform built for modern " +
                "global trade.",

            linkText = "Explore our network",
            linkUrl = "#routes",

            stats = new[]
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
                    label = "Global Tracking"
                }
            },

            locations = new[]
            {
                new
                {
                    name = "Baku",
                    subtitle = "Azerbaijan",
                    position = "baku",
                    accent = false
                },
                new
                {
                    name = "Istanbul",
                    subtitle = "Türkiye",
                    position = "istanbul",
                    accent = false
                },
                new
                {
                    name = "Dubai",
                    subtitle = "UAE",
                    position = "dubai",
                    accent = true
                },
                new
                {
                    name = "Singapore",
                    subtitle = "Asia",
                    position = "singapore",
                    accent = true
                }
            },

            bottomLabel = "GLOBAL MARITIME NETWORK",
            bottomTitle = "Any Port. Any Route."
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "GlobalNetwork",
            Name = "Global Network",
            SortOrder = 3,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl =
                "/uploads/cms/default/global-network-map.png",
            CreatedAtUtc = now
        };
    }

    private static HomePageSection CreateTrackingSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "TRACK YOUR SHIPMENT",

            titleLines = new[]
            {
                "Real-Time",
                "Tracking."
            },

            highlightedTitle = "Total Transparency.",

            description =
                "Track your cargo at every stage of the voyage. " +
                "Enter your SeaTrack tracking number to see the latest " +
                "shipment status, route and delivery progress.",

            inputPlaceholder = "Enter tracking number",
            buttonText = "Track Shipment",

            stats = new[]
            {
                new
                {
                    value = "24/7",
                    label = "Live visibility"
                },
                new
                {
                    value = "6",
                    label = "Tracking stages"
                },
                new
                {
                    value = "100%",
                    label = "Transparent"
                }
            },

            demoShipment = new
            {
                badge = "LIVE VOYAGE",
                voyageNumber = "ST-2026-001",
                panelLabel = "SHIPMENT STATUS",
                route = "Baku → Aktau",
                status = "In Transit",
                trackingLabel = "Tracking number",
                trackingNumber = "ST-2026-001"
            },

            stages = new[]
            {
                new
                {
                    number = "01",
                    title = "Loaded",
                    description =
                        "Cargo loaded into container",
                    state = "completed"
                },
                new
                {
                    number = "02",
                    title = "Departed",
                    description =
                        "Departed from Baku Port",
                    state = "completed"
                },
                new
                {
                    number = "03",
                    title = "In Transit",
                    description =
                        "Shipment is currently at sea",
                    state = "current"
                },
                new
                {
                    number = "04",
                    title = "Arrived",
                    description =
                        "Arrival at destination port",
                    state = "pending"
                },
                new
                {
                    number = "05",
                    title = "Unloaded",
                    description =
                        "Cargo unloaded from vessel",
                    state = "pending"
                },
                new
                {
                    number = "06",
                    title = "Delivered",
                    description =
                        "Transportation completed",
                    state = "pending"
                }
            }
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "Tracking",
            Name = "Tracking",
            SortOrder = 4,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl =
                "/uploads/cms/default/tracking-ship.jpg",
            CreatedAtUtc = now
        };
    }

    private static HomePageSection CreateDestinationsSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "OUR DESTINATIONS",

            title = "Trade Without",

            highlightedTitle = "Borders.",

            description =
                "SeaTrack connects strategic ports and maritime trade routes, " +
                "helping businesses move cargo efficiently across regions and " +
                "international markets.",

            linkText = "Explore all routes",
            linkUrl = "#destinations",

            destinations = new[]
            {
                new
                {
                    code = "01",
                    region = "CASPIAN SEA",
                    title = "Baku → Aktau",
                    description =
                        "Fast and reliable maritime connection between " +
                        "Azerbaijan and Kazakhstan across the Caspian Sea.",
                    ports = "Baku Port • Aktau Port",
                    imageUrl =
                        "/uploads/cms/default/baku-aktau-route.jpg"
                },

                new
                {
                    code = "02",
                    region = "BLACK SEA",
                    title = "Baku → Istanbul",
                    description =
                        "Integrated maritime logistics connecting the Caspian " +
                        "region with one of Europe’s major trade gateways.",
                    ports = "Azerbaijan • Türkiye",
                    imageUrl =
                        "/uploads/cms/default/baku-istanbul-route.jpg"
                },

                new
                {
                    code = "03",
                    region = "MIDDLE EAST",
                    title = "Baku → Dubai",
                    description =
                        "Flexible cargo solutions connecting regional businesses " +
                        "with major Middle Eastern logistics hubs.",
                    ports = "Azerbaijan • UAE",
                    imageUrl =
                        "/uploads/cms/default/baku-dubai-route.jpg"
                },

                new
                {
                    code = "04",
                    region = "ASIA",
                    title = "Baku → Singapore",
                    description =
                        "Long-distance international freight solutions connecting " +
                        "the Caspian region with Asian trade networks.",
                    ports = "Azerbaijan • Singapore",
                    imageUrl =
                        "/uploads/cms/default/baku-singapore-route.jpg"
                }
            }
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "Destinations",
            Name = "Destinations",
            SortOrder = 5,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl = null,
            CreatedAtUtc = now
        };
    }

    private static HomePageSection CreateWhySeaTrackSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "WHY SEATRACK",

            title = "Logistics made",

            highlightedTitle = "clear and simple.",

            description =
                "SeaTrack brings customers and logistics operations together " +
                "in one maritime platform — from the first shipping request " +
                "to final cargo delivery.",

            imageOverlayLabel = "GLOBAL LOGISTICS",

            imageOverlayTitle =
                "One connected maritime platform.",

            linkText = "Discover SeaTrack",
            linkUrl = "#services",

            advantages = new[]
            {
                new
                {
                    number = "01",
                    title = "Complete Visibility",
                    text =
                        "Track every stage of your shipment from loading and " +
                        "departure to arrival and final delivery."
                },

                new
                {
                    number = "02",
                    title = "Smart Operations",
                    text =
                        "Manage shipping orders, containers, vessels, routes " +
                        "and voyages through one connected platform."
                },

                new
                {
                    number = "03",
                    title = "Reliable Network",
                    text =
                        "Connect cargo with trusted maritime routes and strategic " +
                        "ports across international trade corridors."
                },

                new
                {
                    number = "04",
                    title = "Secure & Transparent",
                    text =
                        "Keep quotes, invoices, payments and shipment information " +
                        "organized with clear status updates."
                }
            }
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "WhySeaTrack",
            Name = "Why SeaTrack",
            SortOrder = 6,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl =
                "/uploads/cms/default/why-seatrack-port.jpg",
            CreatedAtUtc = now
        };
    }

    private static HomePageSection CreateCallToActionSection(
        int homePageId,
        DateTime now)
    {
        var content = new
        {
            label = "READY TO SHIP?",

            title = "Ready to move",

            highlightedTitle = "your cargo?",

            description =
                "Start your shipment with SeaTrack and manage your cargo, " +
                "quotes, payments and tracking through one connected " +
                "maritime logistics platform.",

            primaryButtonText = "Start Shipping",
            primaryButtonUrl = "/register",

            secondaryButtonText = "Track Shipment",
            secondaryButtonUrl = "#tracking",

            features = new[]
            {
                "Global Network",
                "Secure Shipping",
                "Real-Time Tracking"
            },

            networkLabel = "SEATRACK GLOBAL NETWORK",

            originLabel = "ORIGIN",
            origin = "Baku",

            destinationLabel = "DESTINATION",
            destination = "Global Ports",

            miniCardLabel = "GLOBAL MARITIME LOGISTICS",

            miniCardTitle =
                "Connected across international trade routes.",

            miniCardText =
                "Reliable shipping. Transparent operations.",

            status = "Network Online"
        };

        return new HomePageSection
        {
            HomePageContentId = homePageId,
            SectionType = "CallToAction",
            Name = "Call To Action",
            SortOrder = 7,
            IsVisible = true,
            ContentJson = Serialize(content),
            ImageUrl = null,
            CreatedAtUtc = now
        };
    }

    private static string Serialize(object content)
    {
        return JsonSerializer.Serialize(
            content,
            JsonOptions);
    }
}