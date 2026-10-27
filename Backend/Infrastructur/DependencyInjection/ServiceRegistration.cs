using Application.Features.Identity.GetMe.Interfaces;
using Application.Features.Identity.Login.Interfaces;
using Application.Features.Identity.Register.Interfaces;
using Application.Features.Identity.Tokens.Interfaces;
using Application.Features.Logistics.Berths.Create.Interfaces;
using Application.Features.Logistics.Berths.Delete.Interfaces;
using Application.Features.Logistics.Berths.GetAll.Interfaces;
using Application.Features.Logistics.Berths.GetById.Interfaces;
using Application.Features.Logistics.Berths.Update.Interfaces;
using Application.Features.Logistics.Containers.Create.Interfaces;
using Application.Features.Logistics.Containers.Delete.Interfaces;
using Application.Features.Logistics.Containers.GetAll.Interfaces;
using Application.Features.Logistics.Containers.GetById.Interfaces;
using Application.Features.Logistics.Containers.Update.Interfaces;
using Application.Features.Logistics.PortCalls.Create.Interfaces;
using Application.Features.Logistics.PortCalls.Delete.Interfaces;
using Application.Features.Logistics.PortCalls.GetAll.Interfaces;
using Application.Features.Logistics.PortCalls.GetById.Interfaces;
using Application.Features.Logistics.PortCalls.Update.Interfaces;
using Application.Features.Logistics.Ports.Create.Interfaces;
using Application.Features.Logistics.Ports.Delete.Interfaces;
using Application.Features.Logistics.Ports.GetAll.Interfaces;
using Application.Features.Logistics.Ports.GetById.Interfaces;
using Application.Features.Logistics.Ports.Update.Interfaces;
using Application.Features.Logistics.Routes.Create.Interfaces;
using Application.Features.Logistics.Routes.Delete.Interfaces;
using Application.Features.Logistics.Routes.GetAll.Interfaces;
using Application.Features.Logistics.Routes.GetById.Interfaces;
using Application.Features.Logistics.Routes.Update.Interfaces;
using Application.Features.Logistics.Terminals.Create.Interfaces;
using Application.Features.Logistics.Terminals.Delete.Interfaces;
using Application.Features.Logistics.Terminals.GetAll.Interfaces;
using Application.Features.Logistics.Terminals.GetById.Interfaces;
using Application.Features.Logistics.Terminals.Update.Interfaces;
using Application.Features.Logistics.Vessels.Create.Interfaces;
using Application.Features.Logistics.Vessels.Delete.Interfaces;
using Application.Features.Logistics.Vessels.GetAll.Interfaces;
using Application.Features.Logistics.Vessels.GetById.Interfaces;
using Application.Features.Logistics.Vessels.Update.Interfaces;
using Application.Features.Logistics.Voyages.Create.Interfaces;
using Application.Features.Logistics.Voyages.Delete.Interfaces;
using Application.Features.Logistics.Voyages.GetAll.Interfaces;
using Application.Features.Logistics.Voyages.GetById.Interfaces;
using Application.Features.Logistics.Voyages.Update.Interfaces;
using Application.Features.PublicWebsite.About.Get.Interfaces;
using Application.Features.PublicWebsite.Blog.GetPublished.Interfaces;
using Application.Features.PublicWebsite.Home.Get.Interfaces;
using Application.Features.PublicWebsite.Services.Get.Interfaces;
using Application.Features.Shipping.Customer.Cancel.Interfaces;
using Application.Features.Shipping.Customer.Create.Interfaces;
using Application.Features.Shipping.Customer.GetById.Interfaces;
using Application.Features.Shipping.Customer.GetMy.Interfaces;
using Application.Features.Shipping.Customer.Invoice.GetByOrderId.Interfaces;
using Application.Features.Shipping.Customer.Payment.GetMy.Interfaces;
using Application.Features.Shipping.Customer.Payment.Pay.Interfaces;
using Application.Features.Shipping.Customer.Quote.Accept.Interfaces;
using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.Interfaces;
using Application.Features.Shipping.Customer.Quote.Reject.Interfaces;
using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.Interfaces;
using Application.Features.Shipping.Customer.Update.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Invoice.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Payment.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Quote.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Load.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.Interfaces;
using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.Interfaces;
using Application.Features.ShippingOrders.LogisticsAdmin.Assignment.Interfaces;
using Application.Features.WebSiteAdmin.About.Create.Interfaces;
using Application.Features.WebSiteAdmin.About.Delete.Interfaces;
using Application.Features.WebSiteAdmin.About.Get.Interfaces;
using Application.Features.WebSiteAdmin.About.Reorder.Interfaces;
using Application.Features.WebSiteAdmin.About.Update.Interfaces;
using Application.Features.WebSiteAdmin.About.Visibility.Interfaces;
using Application.Features.WebSiteAdmin.Blog.Create.Interfaces;
using Application.Features.WebSiteAdmin.Blog.Delete.Interfaces;
using Application.Features.WebSiteAdmin.Blog.GetAll.Interfaces;
using Application.Features.WebSiteAdmin.Blog.Update.Interfaces;
using Application.Features.WebSiteAdmin.Home.Create.Interfaces;
using Application.Features.WebSiteAdmin.Home.Delete.Interfaces;
using Application.Features.WebSiteAdmin.Home.Get.Interfaces;
using Application.Features.WebSiteAdmin.Home.Reorder.Interfaces;
using Application.Features.WebSiteAdmin.Home.Update.Interfaces;
using Application.Features.WebSiteAdmin.Home.Visibility.Interfaces;
using Application.Features.WebSiteAdmin.Services.Get.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Create.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Delete.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Reorder.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Update.Interfaces;
using Application.Features.WebSiteAdmin.Services.Items.Visibility.Interfaces;
using Application.Features.WebSiteAdmin.Services.Update.Interfaces;
using Infrastructur.Features.Logistics.Berths.Create;
using Infrastructur.Features.Logistics.Berths.Delete;
using Infrastructur.Features.Logistics.Berths.GetAll;
using Infrastructur.Features.Logistics.Berths.GetById;
using Infrastructur.Features.Logistics.Berths.Update;
using Infrastructur.Features.Logistics.Containers.Create;
using Infrastructur.Features.Logistics.Containers.Delete;
using Infrastructur.Features.Logistics.Containers.GetAll;
using Infrastructur.Features.Logistics.Containers.GetById;
using Infrastructur.Features.Logistics.Containers.Update;
using Infrastructur.Features.Logistics.PortCalls.Create;
using Infrastructur.Features.Logistics.PortCalls.Delete;
using Infrastructur.Features.Logistics.PortCalls.GetAll;
using Infrastructur.Features.Logistics.PortCalls.GetById;
using Infrastructur.Features.Logistics.PortCalls.Update;
using Infrastructur.Features.Logistics.Ports.Create;
using Infrastructur.Features.Logistics.Ports.Delete;
using Infrastructur.Features.Logistics.Ports.GetAll;
using Infrastructur.Features.Logistics.Ports.GetById;
using Infrastructur.Features.Logistics.Ports.Update;
using Infrastructur.Features.Logistics.Routes.Create;
using Infrastructur.Features.Logistics.Routes.Delete;
using Infrastructur.Features.Logistics.Routes.GetAll;
using Infrastructur.Features.Logistics.Routes.GetById;
using Infrastructur.Features.Logistics.Routes.Update;
using Infrastructur.Features.Logistics.Terminals.Create;
using Infrastructur.Features.Logistics.Terminals.Delete;
using Infrastructur.Features.Logistics.Terminals.GetAll;
using Infrastructur.Features.Logistics.Terminals.GetById;
using Infrastructur.Features.Logistics.Terminals.Update;
using Infrastructur.Features.Logistics.Vessels.Create;
using Infrastructur.Features.Logistics.Vessels.Delete;
using Infrastructur.Features.Logistics.Vessels.GetAll;
using Infrastructur.Features.Logistics.Vessels.GetById;
using Infrastructur.Features.Logistics.Vessels.Update;
using Infrastructur.Features.Logistics.Voyages.Create;
using Infrastructur.Features.Logistics.Voyages.Delete;
using Infrastructur.Features.Logistics.Voyages.GetAll;
using Infrastructur.Features.Logistics.Voyages.GetById;
using Infrastructur.Features.Logistics.Voyages.Update;
using Infrastructur.Features.PublicWebsite.About.Get;
using Infrastructur.Features.PublicWebsite.Blog.GetPublished;
using Infrastructur.Features.PublicWebsite.Home.Get;
using Infrastructur.Features.PublicWebsite.Home.Get;
using Infrastructur.Features.PublicWebsite.Services.Get;
using Infrastructur.Features.ShippingOrders.Customer.Cancel;
using Infrastructur.Features.ShippingOrders.Customer.Create;
using Infrastructur.Features.ShippingOrders.Customer.GetById;
using Infrastructur.Features.ShippingOrders.Customer.GetMy;
using Infrastructur.Features.ShippingOrders.Customer.Invoice.GetByOrderId;
using Infrastructur.Features.ShippingOrders.Customer.Payment.GetMy;
using Infrastructur.Features.ShippingOrders.Customer.Payment.Pay;
using Infrastructur.Features.ShippingOrders.Customer.Quote.Accept;
using Infrastructur.Features.ShippingOrders.Customer.Quote.GetByShippingOrderId;
using Infrastructur.Features.ShippingOrders.Customer.Quote.Reject;
using Infrastructur.Features.ShippingOrders.Customer.Shipment.GetByShippingOrderId;
using Infrastructur.Features.ShippingOrders.Customer.Update;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Assignment;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Customers.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Invoice.Create;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Invoice.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Payment.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Quote.Create;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Quote.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Arrive;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Create;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Deliver;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Depart;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Load;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Start;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Unload;
using Infrastructur.Features.ShippingOrders.Public.Tracking.GetByTrackingNumber;
using Infrastructur.Features.WebSiteAdmin.About.Create;
using Infrastructur.Features.WebSiteAdmin.About.Delete;
using Infrastructur.Features.WebSiteAdmin.About.Get;
using Infrastructur.Features.WebSiteAdmin.About.Reorder;
using Infrastructur.Features.WebSiteAdmin.About.Update;
using Infrastructur.Features.WebSiteAdmin.About.Visibility;
using Infrastructur.Features.WebSiteAdmin.Blog.Create;
using Infrastructur.Features.WebSiteAdmin.Blog.Delete;
using Infrastructur.Features.WebSiteAdmin.Blog.GetAll;
using Infrastructur.Features.WebSiteAdmin.Blog.Update;
using Infrastructur.Features.WebSiteAdmin.Home.Create;
using Infrastructur.Features.WebSiteAdmin.Home.Delete;
using Infrastructur.Features.WebSiteAdmin.Home.Get;
using Infrastructur.Features.WebSiteAdmin.Home.Reorder;
using Infrastructur.Features.WebSiteAdmin.Home.Update;
using Infrastructur.Features.WebSiteAdmin.Home.Visibility;
using Infrastructur.Features.WebSiteAdmin.Services.Get;
using Infrastructur.Features.WebSiteAdmin.Services.Items.Create;
using Infrastructur.Features.WebSiteAdmin.Services.Items.Delete;
using Infrastructur.Features.WebSiteAdmin.Services.Items.Reorder;
using Infrastructur.Features.WebSiteAdmin.Services.Items.Update;
using Infrastructur.Features.WebSiteAdmin.Services.Items.Visibility;
using Infrastructur.Features.WebSiteAdmin.Services.Update;
using Infrastructur.Identity.GetMe;
using Infrastructur.Identity.Login;
using Infrastructur.Identity.Register;
using Infrastructur.Identity.Seeding;
using Infrastructur.Identity.Services;
using Microsoft.Extensions.DependencyInjection;
using LogisticsAdminGetShipmentHandler =
    Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.GetByShippingOrderId.GetShipmentHandler;
using LogisticsAdminGetShipmentHandlerInterface =
    Application.Features.Shipping.LogisticsAdmin.Shipment.GetByShippingOrderId.Interfaces.IGetShipmentHandler;
using LogisticsAdminGetShippingOrderByIdHandler =
    Infrastructur.Features.ShippingOrders.LogisticsAdmin.GetById.GetShippingOrderByIdHandler;
using LogisticsAdminGetShippingOrderByIdHandlerInterface =
    Application.Features.Shipping.LogisticsAdmin.GetById.Interfaces.IGetShippingOrderByIdHandler;
namespace Infrastructur.DependencyInjection;

public static class ServiceRegistration
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        // =========================================================
        // Identity
        // =========================================================

        services.AddScoped<IRegisterHandler, RegisterHandler>();
        services.AddScoped<ILoginHandler, LoginHandler>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IGetMeHandler, GetMeHandler>();
        services.AddScoped<IdentitySeeder>();


        // =========================================================
        // Customer - Shipping Orders
        // =========================================================

        services.AddScoped<
            ICreateShippingOrderHandler,
            CreateShippingOrderHandler>();

        services.AddScoped<
            IGetMyShippingOrdersHandler,
            GetMyShippingOrdersHandler>();

        services.AddScoped<
            IGetShippingOrderByIdHandler,
            GetShippingOrderByIdHandler>();

        services.AddScoped<
            IUpdateShippingOrderHandler,
            UpdateShippingOrderHandler>();

        services.AddScoped<
            ICancelShippingOrderHandler,
            CancelShippingOrderHandler>();


        // =========================================================
        // Customer - Quote
        // =========================================================

        services.AddScoped<
            IGetQuoteByShippingOrderIdHandler,
            GetQuoteByShippingOrderIdHandler>();

        services.AddScoped<
            IAcceptQuoteHandler,
            AcceptQuoteHandler>();

        services.AddScoped<
            IRejectQuoteHandler,
            RejectQuoteHandler>();


        // =========================================================
        // Customer - Payment
        // =========================================================

        services.AddScoped<
            IPayInvoiceHandler,
            PayInvoiceHandler>();


        // =========================================================
        // Customer - Shipment / Tracking
        // =========================================================

        services.AddScoped<
            IGetShipmentHandler,
            GetShipmentHandler>();


        // =========================================================
        // Logistics Admin - Shipping Orders
        // =========================================================

        services.AddScoped<
            IGetAllShippingOrdersHandler,
            GetAllShippingOrdersHandler>();

        services.AddScoped<
            LogisticsAdminGetShippingOrderByIdHandlerInterface,
            LogisticsAdminGetShippingOrderByIdHandler>();


        // =========================================================
        // Logistics Admin - Quote
        // =========================================================

        services.AddScoped<
            ICreateQuoteHandler,
            CreateQuoteHandler>();


        // =========================================================
        // Logistics Admin - Invoice
        // =========================================================

        services.AddScoped<
            ICreateInvoiceHandler,
            CreateInvoiceHandler>();


        // =========================================================
        // Logistics Admin - Shipment
        // =========================================================

        services.AddScoped<
            ICreateShipmentHandler,
            CreateShipmentHandler>();

        services.AddScoped<
            ILoadShipmentHandler,
            LoadShipmentHandler>();

        services.AddScoped<
            IDepartShipmentHandler,
            DepartShipmentHandler>();

        services.AddScoped<
            IStartShipmentHandler,
            StartShipmentHandler>();

        services.AddScoped<
            IArriveShipmentHandler,
            ArriveShipmentHandler>();

        services.AddScoped<
            IUnloadShipmentHandler,
            UnloadShipmentHandler>();

        services.AddScoped<
            IDeliverShipmentHandler,
            DeliverShipmentHandler>();


        // =========================================================
        // Logistics - Ports
        // =========================================================

        services.AddScoped<
            IGetAllPortsHandler,
            GetAllPortsHandler>();


        // =========================================================
        // Public - Tracking
        // =========================================================

        services.AddScoped<
            IGetTrackingByTrackingNumberHandler,
            GetTrackingByTrackingNumberHandler>();



        // =========================================================
        // Logistics - Ports
        // =========================================================

        services.AddScoped<
            IGetAllPortsHandler,
            GetAllPortsHandler>();

        services.AddScoped<
            ICreatePortHandler,
            CreatePortHandler>();

        services.AddScoped<
    IGetPortByIdHandler,
    GetPortByIdHandler>();


        // =========================================================
        // Logistics - Ports
        // =========================================================

        services.AddScoped<
            IGetAllPortsHandler,
            GetAllPortsHandler>();

        services.AddScoped<
            IGetPortByIdHandler,
            GetPortByIdHandler>();

        services.AddScoped<
            ICreatePortHandler,
            CreatePortHandler>();

        services.AddScoped<
            IUpdatePortHandler,
            UpdatePortHandler>();

        services.AddScoped<
             IDeletePortHandler,
             DeletePortHandler>();


        // =========================================================
        // Logistics - Terminals
        // =========================================================

        services.AddScoped<
            ICreateTerminalHandler,
            CreateTerminalHandler>();


        // =========================================================
        // Logistics - Terminals
        // =========================================================

        services.AddScoped<
            ICreateTerminalHandler,
            CreateTerminalHandler>();

        services.AddScoped<
            IGetAllTerminalsHandler,
            GetAllTerminalsHandler>();

        services.AddScoped<
            IGetTerminalByIdHandler,
            GetTerminalByIdHandler>();

        services.AddScoped<
            IUpdateTerminalHandler,
            UpdateTerminalHandler>();

        services.AddScoped<
            IDeleteTerminalHandler,
            DeleteTerminalHandler>();



        // =========================================================
        // Logistics - Berths
        // =========================================================

        services.AddScoped<
            ICreateBerthHandler,
            CreateBerthHandler>();

        services.AddScoped<
            IGetAllBerthsHandler,
            GetAllBerthsHandler>();
        services.AddScoped<
            IGetBerthByIdHandler,
            GetBerthByIdHandler>();

        services.AddScoped<
            IUpdateBerthHandler,
            UpdateBerthHandler>();

        services.AddScoped<
            IDeleteBerthHandler,
            DeleteBerthHandler>();

        // =========================================================
        // Logistics - Vessels
        // =========================================================

        services.AddScoped<
            ICreateVesselHandler,
            CreateVesselHandler>();

        services.AddScoped<
            IGetAllVesselsHandler,
            GetAllVesselsHandler>();

        services.AddScoped<
            IGetVesselByIdHandler,
            GetVesselByIdHandler>();

        services.AddScoped<
         IUpdateVesselHandler,
         UpdateVesselHandler>();


        services.AddScoped<
            IDeleteVesselHandler,
            DeleteVesselHandler>();



        // =========================================================
        // Logistics - Containers
        // =========================================================

        services.AddScoped<
            ICreateContainerHandler,
            CreateContainerHandler>();

        services.AddScoped<
            IGetAllContainersHandler,
            GetAllContainersHandler>();

        services.AddScoped<
            IGetContainerByIdHandler,
            GetContainerByIdHandler>();
        services.AddScoped<
            IUpdateContainerHandler,
            UpdateContainerHandler>();

        services.AddScoped<
            IDeleteContainerHandler,
            DeleteContainerHandler>();



        // =========================================================
        // Logistics - Routes
        // =========================================================

        services.AddScoped<
            ICreateRouteHandler,
            CreateRouteHandler>();

        services.AddScoped<
            IGetAllRoutesHandler,
            GetAllRoutesHandler>();

        services.AddScoped<
            IGetRouteByIdHandler,
            GetRouteByIdHandler>();

        services.AddScoped<
            IUpdateRouteHandler,
            UpdateRouteHandler>();

        services.AddScoped<
            IDeleteRouteHandler,
            DeleteRouteHandler>();


        // Logistics - Voyages
        services.AddScoped<
            ICreateVoyageHandler,
            CreateVoyageHandler>();

        services.AddScoped<
            IGetAllVoyagesHandler,
            GetAllVoyagesHandler>();

        services.AddScoped<
            IGetVoyageByIdHandler,
            GetVoyageByIdHandler>();

        services.AddScoped<
            IUpdateVoyageHandler,
            UpdateVoyageHandler>();

        services.AddScoped<
            IDeleteVoyageHandler,
            DeleteVoyageHandler>();



        // Logistics - Port Calls
        services.AddScoped<
            ICreatePortCallHandler,
            CreatePortCallHandler>();

        services.AddScoped<
            IGetAllPortCallsHandler,
            GetAllPortCallsHandler>();

        services.AddScoped<
            IGetPortCallByIdHandler,
            GetPortCallByIdHandler>();

        services.AddScoped<
            IUpdatePortCallHandler,
            UpdatePortCallHandler>();

        services.AddScoped<
            IDeletePortCallHandler,
            DeletePortCallHandler>();



        services.AddScoped<
            IAssignShippingOrderHandler,
            AssignShippingOrderHandler>();




        services.AddScoped<
            LogisticsAdminGetShipmentHandlerInterface,
            LogisticsAdminGetShipmentHandler>();


        services.AddScoped<
            IGetAllShipmentsHandler,
            GetAllShipmentsHandler>();

        services.AddScoped<
            IGetInvoiceByOrderIdHandler,
            GetInvoiceByOrderIdHandler>();
        services.AddScoped<
            IGetMyPaymentsHandler,
            GetMyPaymentsHandler>();

        services.AddScoped<IGetCustomersHandler, GetCustomersHandler>();
        services.AddScoped<IGetAllQuotesHandler, GetAllQuotesHandler>();
        services.AddScoped<IGetAllInvoicesHandler, GetAllInvoicesHandler>();
        services.AddScoped<IGetAllPaymentsHandler, GetAllPaymentsHandler>();

        //------------------WebSiteAdmin------------------//
        services.AddScoped<ICreateBlogPostHandler, CreateBlogPostHandler>();
        services.AddScoped<IGetAllBlogPostsHandler, GetAllBlogPostsHandler>();
        services.AddScoped<IUpdateBlogPostHandler, UpdateBlogPostHandler>();
        services.AddScoped<IDeleteBlogPostHandler, DeleteBlogPostHandler>();
        services.AddScoped<IGetPublishedBlogPostsHandler, GetPublishedBlogPostsHandler>();
        


        // =========================================================
        // Website Admin - Blog CMS
        // =========================================================

        services.AddScoped<
            ICreateBlogPostHandler,
            CreateBlogPostHandler>();

        services.AddScoped<
            IGetAllBlogPostsHandler,
            GetAllBlogPostsHandler>();

        services.AddScoped<
            IUpdateBlogPostHandler,
            UpdateBlogPostHandler>();

        services.AddScoped<
            IDeleteBlogPostHandler,
            DeleteBlogPostHandler>();

        services.AddScoped<
            IGetPublishedBlogPostsHandler,
            GetPublishedBlogPostsHandler>();


        // =========================================================
        // Website Admin - Home Page CMS
        // =========================================================

        services.AddScoped<
            IGetHomePageHandler,
            GetHomePageHandler>();

        services.AddScoped<
            ICreateHomePageSectionHandler,
            CreateHomePageSectionHandler>();

        services.AddScoped<
            IUpdateHomePageSectionHandler,
            UpdateHomePageSectionHandler>();

        services.AddScoped<
            IDeleteHomePageSectionHandler,
            DeleteHomePageSectionHandler>();

        services.AddScoped<
            IUpdateHomePageSectionVisibilityHandler,
            UpdateHomePageSectionVisibilityHandler>();

        services.AddScoped<
            IReorderHomePageSectionsHandler,
            ReorderHomePageSectionsHandler>();

        // =========================================================
        // Public Website - Home Page
        // =========================================================

        services.AddScoped<
            IGetPublicHomePageHandler,
            GetPublicHomePageHandler>();



        // =========================================================
        // Public Website - Home Page
        // =========================================================

        services.AddScoped<
            IGetPublicHomePageHandler,
            GetPublicHomePageHandler>();



        // =========================================================
        // Public Website - Services Page
        // =========================================================

        services.AddScoped<
            IGetPublicServicesPageHandler,
            GetPublicServicesPageHandler>();


        // =========================================================
        // Website Admin - Services Page CMS
        // =========================================================

        services.AddScoped<
            IGetServicesPageHandler,
            GetServicesPageHandler>();


        services.AddScoped<
              IUpdateServicesPageHandler,
              UpdateServicesPageHandler>();
        services.AddScoped<
            ICreateServiceItemHandler,
            CreateServiceItemHandler>();
        services.AddScoped<
            IUpdateServiceItemHandler,
            UpdateServiceItemHandler>();
        services.AddScoped<
            IDeleteServiceItemHandler,
            DeleteServiceItemHandler>();
        services.AddScoped<
            IUpdateServiceItemVisibilityHandler,
            UpdateServiceItemVisibilityHandler>();

        services.AddScoped<
            IReorderServiceItemsHandler,
            ReorderServiceItemsHandler>();



        // =========================================================
        // Website Admin - About Page CMS
        // =========================================================

        services.AddScoped<
            IGetAboutPageHandler,
            GetAboutPageHandler>();

        services.AddScoped<
            ICreateAboutPageSectionHandler,
            CreateAboutPageSectionHandler>();

        services.AddScoped<
            IUpdateAboutPageSectionHandler,
            UpdateAboutPageSectionHandler>();

        services.AddScoped<
            IDeleteAboutPageSectionHandler,
            DeleteAboutPageSectionHandler>();

        services.AddScoped<
            IUpdateAboutPageSectionVisibilityHandler,
            UpdateAboutPageSectionVisibilityHandler>();

        services.AddScoped<
            IReorderAboutPageSectionsHandler,
            ReorderAboutPageSectionsHandler>();


        // =========================================================
        // Public Website - About Page
        // =========================================================

        services.AddScoped<
            IGetPublicAboutPageHandler,
            GetPublicAboutPageHandler>();

        return services;















        return services;
    }
}
    

