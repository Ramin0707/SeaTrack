using Application.Features.Shipping.LogisticsAdmin.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.GetById.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetById.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Load.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Load.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.Interfaces;
using Application.Features.ShippingOrders.LogisticsAdmin.Assignment.DTOs;
using Application.Features.ShippingOrders.LogisticsAdmin.Assignment.Interfaces;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.Assignment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.LogisticsAdmin;

[ApiController]
[Route("api/admin/shipping-orders")]
[Authorize(Roles = "Admin,Operator")]
public class ShippingOrdersController : ControllerBase
{
    private readonly IGetAllShippingOrdersHandler _getAllShippingOrdersHandler;
    private readonly IGetShippingOrderByIdHandler _getShippingOrderByIdHandler;

    private readonly ICreateQuoteHandler _createQuoteHandler;
    private readonly ICreateInvoiceHandler _createInvoiceHandler;

    private readonly ICreateShipmentHandler _createShipmentHandler;
    private readonly ILoadShipmentHandler _loadShipmentHandler;
    private readonly IDepartShipmentHandler _departShipmentHandler;
    private readonly IStartShipmentHandler _startShipmentHandler;
    private readonly IArriveShipmentHandler _arriveShipmentHandler;
    private readonly IDeliverShipmentHandler _deliverShipmentHandler;
    private readonly IUnloadShipmentHandler _unloadShipmentHandler;
    private readonly IAssignShippingOrderHandler _assignShippingOrderHandler;

    public ShippingOrdersController(
        IAssignShippingOrderHandler assignShippingOrderHandler,
        IUnloadShipmentHandler unloadShipmentHandler,
        IGetAllShippingOrdersHandler getAllShippingOrdersHandler,
        IGetShippingOrderByIdHandler getShippingOrderByIdHandler,
        ICreateQuoteHandler createQuoteHandler,
        ICreateInvoiceHandler createInvoiceHandler,
        ICreateShipmentHandler createShipmentHandler,
        ILoadShipmentHandler loadShipmentHandler,
        IDepartShipmentHandler departShipmentHandler,
        IStartShipmentHandler startShipmentHandler,
        IArriveShipmentHandler arriveShipmentHandler,
        IDeliverShipmentHandler deliverShipmentHandler
       )
    {
        _getAllShippingOrdersHandler = getAllShippingOrdersHandler;
        _getShippingOrderByIdHandler = getShippingOrderByIdHandler;

        _createQuoteHandler = createQuoteHandler;
        _createInvoiceHandler = createInvoiceHandler;

        _createShipmentHandler = createShipmentHandler;
        _loadShipmentHandler = loadShipmentHandler;
        _departShipmentHandler = departShipmentHandler;
        _startShipmentHandler = startShipmentHandler;
        _arriveShipmentHandler = arriveShipmentHandler;
        _deliverShipmentHandler = deliverShipmentHandler;
        _unloadShipmentHandler = unloadShipmentHandler;
        _assignShippingOrderHandler = assignShippingOrderHandler;
    }

    // =========================================================
    // Shipping Orders
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<List<GetAllShippingOrderResponseDto>>> GetAll()
    {
        var result = await _getAllShippingOrdersHandler.HandleAsync();

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetShippingOrderByIdResponseDto>> GetById(
        int id)
    {
        var result = await _getShippingOrderByIdHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // =========================================================
    // Quote
    // =========================================================

    [HttpPost("{id:int}/quote")]
    public async Task<ActionResult<CreateQuoteResponseDto>> CreateQuote(
        int id,
        CreateQuoteRequestDto request)
    {
        var result = await _createQuoteHandler.HandleAsync(
            id,
            request);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // =========================================================
    // Invoice
    // =========================================================

    [HttpPost("{id:int}/invoice")]
    public async Task<ActionResult<CreateInvoiceResponseDto>> CreateInvoice(
        int id)
    {
        var result = await _createInvoiceHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // =========================================================
    // Shipment
    // =========================================================

    [HttpPost("{id:int}/shipment")]
    public async Task<ActionResult<CreateShipmentResponseDto>> CreateShipment(
        int id)
    {
        var result = await _createShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // Preparing -> Loaded
    [HttpPatch("{id:int}/shipment/load")]
    public async Task<ActionResult<LoadShipmentResponseDto>> LoadShipment(
        int id)
    {
        var result = await _loadShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // Loaded -> Departed
    [HttpPatch("{id:int}/shipment/depart")]
    public async Task<ActionResult<DepartShipmentResponseDto>> DepartShipment(
        int id)
    {
        var result = await _departShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // Departed -> InTransit
    [HttpPatch("{id:int}/shipment/start")]
    public async Task<ActionResult<StartShipmentResponseDto>> StartShipment(
        int id)
    {
        var result = await _startShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // InTransit -> Arrived
    [HttpPatch("{id:int}/shipment/arrive")]
    public async Task<ActionResult<ArriveShipmentResponseDto>> ArriveShipment(
        int id)
    {
        var result = await _arriveShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // Сейчас старый Deliver.
    // Позже изменим на Unloaded -> Delivered.
    [HttpPatch("{id:int}/shipment/deliver")]
    public async Task<ActionResult<DeliverShipmentResponseDto>> DeliverShipment(
        int id)
    {
        var result = await _deliverShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }



    // Arrived -> Unloaded
    [HttpPatch("{id:int}/shipment/unload")]
    public async Task<ActionResult<UnloadShipmentResponseDto>> UnloadShipment(
        int id)
    {
        var result = await _unloadShipmentHandler.HandleAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }



    [HttpPatch("{id:int}/assignment")]
    public async Task<IActionResult> Assign(
    int id,
    [FromBody] AssignShippingOrderRequestDto request)
    {
        var assigned = await _assignShippingOrderHandler.HandleAsync(id, request);

        if (!assigned)
        {
            return BadRequest(new
            {
                message = "Order assignment failed. Check order status, container availability and voyage."
            });
        }

        return Ok(new
        {
            message = "Container and voyage assigned successfully."
        });
    }
}