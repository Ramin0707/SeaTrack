using Application.Features.Identity.GetMe.Interfaces;
using Application.Features.Identity.Login.Interfaces;
using Application.Features.Identity.Register.Interfaces;
using Application.Features.Identity.Tokens.Interfaces;

using Application.Features.Shipping.Customer.Cancel.Interfaces;
using Application.Features.Shipping.Customer.Create.Interfaces;
using Application.Features.Shipping.Customer.GetById.Interfaces;
using Application.Features.Shipping.Customer.GetMy.Interfaces;
using Application.Features.Shipping.Customer.Payment.Pay.Interfaces;
using Application.Features.Shipping.Customer.Quote.Accept.Interfaces;
using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.Interfaces;
using Application.Features.Shipping.Customer.Quote.Reject.Interfaces;
using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.Interfaces;
using Application.Features.Shipping.Customer.Update.Interfaces;

using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.Interfaces;

using Infrastructur.Features.ShippingOrders.Customer.Cancel;
using Infrastructur.Features.ShippingOrders.Customer.Create;
using Infrastructur.Features.ShippingOrders.Customer.GetById;
using Infrastructur.Features.ShippingOrders.Customer.GetMy;
using Infrastructur.Features.ShippingOrders.Customer.Payment.Pay;
using Infrastructur.Features.ShippingOrders.Customer.Quote.Accept;
using Infrastructur.Features.ShippingOrders.Customer.Quote.GetByShippingOrderId;
using Infrastructur.Features.ShippingOrders.Customer.Quote.Reject;
using Infrastructur.Features.ShippingOrders.Customer.Shipment.GetByShippingOrderId;
using Infrastructur.Features.ShippingOrders.Customer.Update;

using Infrastructur.Features.ShippingOrders.LogisticsAdmin.GetAll;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Invoice.Create;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Quote.Create;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Create;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Deliver;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.Start;

using Infrastructur.Identity.GetMe;
using Infrastructur.Identity.Login;
using Infrastructur.Identity.Register;
using Infrastructur.Identity.Seeding;
using Infrastructur.Identity.Services;

using Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.Interfaces;
using Infrastructur.Features.ShippingOrders.Public.Tracking.GetByTrackingNumber;

using Microsoft.Extensions.DependencyInjection;

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
        // Identity
        services.AddScoped<IRegisterHandler, RegisterHandler>();
        services.AddScoped<ILoginHandler, LoginHandler>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IGetMeHandler, GetMeHandler>();
        services.AddScoped<IdentitySeeder>();

        // Customer - Shipping Orders
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

        // Customer - Quote
        services.AddScoped<
            IGetQuoteByShippingOrderIdHandler,
            GetQuoteByShippingOrderIdHandler>();

        services.AddScoped<
            IAcceptQuoteHandler,
            AcceptQuoteHandler>();

        services.AddScoped<
            IRejectQuoteHandler,
            RejectQuoteHandler>();

        // Customer - Payment
        services.AddScoped<
            IPayInvoiceHandler,
            PayInvoiceHandler>();

        // Customer - Shipment / Tracking
        services.AddScoped<
            IGetShipmentHandler,
            GetShipmentHandler>();

        // Logistics Admin - Shipping Orders
        services.AddScoped<
            IGetAllShippingOrdersHandler,
            GetAllShippingOrdersHandler>();

        services.AddScoped<
            LogisticsAdminGetShippingOrderByIdHandlerInterface,
            LogisticsAdminGetShippingOrderByIdHandler>();

        // Logistics Admin - Quote
        services.AddScoped<
            ICreateQuoteHandler,
            CreateQuoteHandler>();

        // Logistics Admin - Invoice
        services.AddScoped<
            ICreateInvoiceHandler,
            CreateInvoiceHandler>();

        // Logistics Admin - Shipment
        services.AddScoped<
            ICreateShipmentHandler,
            CreateShipmentHandler>();

        services.AddScoped<
            IStartShipmentHandler,
            StartShipmentHandler>();

        services.AddScoped<
            IDeliverShipmentHandler,
            DeliverShipmentHandler>();

        // Public - Tracking
        services.AddScoped<
            IGetTrackingByTrackingNumberHandler,
            GetTrackingByTrackingNumberHandler>();

        return services;
    }
}