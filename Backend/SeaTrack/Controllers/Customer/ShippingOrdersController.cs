using Application.Features.Shipping.Customer.Cancel.DTOs;
using Application.Features.Shipping.Customer.Cancel.Interfaces;
using Application.Features.Shipping.Customer.Create.DTOs;
using Application.Features.Shipping.Customer.Create.Interfaces;
using Application.Features.Shipping.Customer.GetById.DTOs;
using Application.Features.Shipping.Customer.GetById.Interfaces;
using Application.Features.Shipping.Customer.GetMy.DTOs;
using Application.Features.Shipping.Customer.GetMy.Interfaces;
using Application.Features.Shipping.Customer.Invoice.GetByOrderId.DTOs;
using Application.Features.Shipping.Customer.Invoice.GetByOrderId.Interfaces;
using Application.Features.Shipping.Customer.Payment.GetMy.DTOs;
using Application.Features.Shipping.Customer.Payment.GetMy.Interfaces;
using Application.Features.Shipping.Customer.Payment.Pay.DTOs;
using Application.Features.Shipping.Customer.Payment.Pay.Interfaces;
using Application.Features.Shipping.Customer.Quote.Accept.DTOs;
using Application.Features.Shipping.Customer.Quote.Accept.Interfaces;
using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.DTOs;
using Application.Features.Shipping.Customer.Quote.GetByShippingOrderId.Interfaces;
using Application.Features.Shipping.Customer.Quote.Reject.DTOs;
using Application.Features.Shipping.Customer.Quote.Reject.Interfaces;
using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.DTOs;
using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.Interfaces;
using Application.Features.Shipping.Customer.Update.DTOs;
using Application.Features.Shipping.Customer.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SeaTrack.Controllers.Customer;

[ApiController]
[Route("api/shipping-orders")]
[Authorize(Roles = "Customer")]
public class ShippingOrdersController : ControllerBase
{
    private readonly ICreateShippingOrderHandler _createShippingOrderHandler;
    private readonly IGetMyShippingOrdersHandler _getMyShippingOrdersHandler;
    private readonly IGetShippingOrderByIdHandler _getShippingOrderByIdHandler;
    private readonly IUpdateShippingOrderHandler _updateShippingOrderHandler;
    private readonly ICancelShippingOrderHandler _cancelShippingOrderHandler;

    private readonly IGetQuoteByShippingOrderIdHandler
        _getQuoteByShippingOrderIdHandler;

    private readonly IAcceptQuoteHandler _acceptQuoteHandler;
    private readonly IRejectQuoteHandler _rejectQuoteHandler;

    private readonly IPayInvoiceHandler _payInvoiceHandler;

    private readonly IGetShipmentHandler _getShipmentHandler;

    private readonly IGetInvoiceByOrderIdHandler  _getInvoiceByOrderIdHandler;
    private readonly IGetMyPaymentsHandler _getMyPaymentsHandler;


    public ShippingOrdersController(
        ICreateShippingOrderHandler createShippingOrderHandler,
        IGetMyShippingOrdersHandler getMyShippingOrdersHandler,
        IGetShippingOrderByIdHandler getShippingOrderByIdHandler,
        IUpdateShippingOrderHandler updateShippingOrderHandler,
        ICancelShippingOrderHandler cancelShippingOrderHandler,
        IGetQuoteByShippingOrderIdHandler getQuoteByShippingOrderIdHandler,
        IAcceptQuoteHandler acceptQuoteHandler,
        IRejectQuoteHandler rejectQuoteHandler,
        IPayInvoiceHandler payInvoiceHandler,
        IGetShipmentHandler getShipmentHandler,
        IGetInvoiceByOrderIdHandler getInvoiceByOrderIdHandler,
        IGetMyPaymentsHandler getMyPaymentsHandler)
    {
        _createShippingOrderHandler =  createShippingOrderHandler;

        _getMyShippingOrdersHandler =  getMyShippingOrdersHandler;

        _getShippingOrderByIdHandler =getShippingOrderByIdHandler;

        _updateShippingOrderHandler =  updateShippingOrderHandler;

        _cancelShippingOrderHandler = cancelShippingOrderHandler;

        _getQuoteByShippingOrderIdHandler = getQuoteByShippingOrderIdHandler;

        _acceptQuoteHandler = acceptQuoteHandler;

        _rejectQuoteHandler =  rejectQuoteHandler;

        _payInvoiceHandler =  payInvoiceHandler;

        _getShipmentHandler = getShipmentHandler;

        _getInvoiceByOrderIdHandler =  getInvoiceByOrderIdHandler;
        _getMyPaymentsHandler = getMyPaymentsHandler;
    }


    /* =====================================
       CREATE ORDER
    ====================================== */

    [HttpPost]
    public async Task<ActionResult<CreateShippingOrderResponseDto>> Create(
        CreateShippingOrderRequestDto request)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _createShippingOrderHandler.HandleAsync(
                customerId,
                request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }


    /* =====================================
       GET MY ORDERS
    ====================================== */

    [HttpGet("my")]
    public async Task<ActionResult<List<GetMyShippingOrderResponseDto>>> GetMy()
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _getMyShippingOrdersHandler.HandleAsync(
                customerId);

        return Ok(result);
    }


    /* =====================================
       GET ORDER BY ID
    ====================================== */

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetShippingOrderByIdResponseDto>> GetById(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _getShippingOrderByIdHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       GET QUOTE
    ====================================== */

    [HttpGet("{id:int}/quote")]
    public async Task<ActionResult<GetQuoteByShippingOrderIdResponseDto>> GetQuote(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _getQuoteByShippingOrderIdHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       ACCEPT QUOTE
    ====================================== */

    [HttpPatch("{id:int}/quote/accept")]
    public async Task<ActionResult<AcceptQuoteResponseDto>> AcceptQuote(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _acceptQuoteHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       REJECT QUOTE
    ====================================== */

    [HttpPatch("{id:int}/quote/reject")]
    public async Task<ActionResult<RejectQuoteResponseDto>> RejectQuote(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _rejectQuoteHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       GET INVOICE
    ====================================== */

    [HttpGet("{id:int}/invoice")]
    public async Task<ActionResult<GetInvoiceByOrderIdResponseDto>> GetInvoice(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _getInvoiceByOrderIdHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       PAY INVOICE
    ====================================== */

    [HttpPost("invoices/{invoiceId:int}/pay")]
    public async Task<ActionResult<PayInvoiceResponseDto>> PayInvoice(
        int invoiceId)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _payInvoiceHandler.HandleAsync(
                invoiceId,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       GET SHIPMENT
    ====================================== */

    [HttpGet("{id:int}/shipment")]
    public async Task<ActionResult<GetShipmentResponseDto>> GetShipment(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _getShipmentHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       UPDATE ORDER
    ====================================== */

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UpdateShippingOrderResponseDto>> Update(
        int id,
        UpdateShippingOrderRequestDto request)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _updateShippingOrderHandler.HandleAsync(
                id,
                customerId,
                request);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
       CANCEL ORDER
    ====================================== */

    [HttpPatch("{id:int}/cancel")]
    public async Task<ActionResult<CancelShippingOrderResponseDto>> Cancel(
        int id)
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _cancelShippingOrderHandler.HandleAsync(
                id,
                customerId);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    /* =====================================
   GET MY PAYMENTS
===================================== */

    [HttpGet("payments/my")]
    public async Task<ActionResult<List<GetMyPaymentResponseDto>>> GetMyPayments()
    {
        var customerId =
            User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Unauthorized();
        }

        var result =
            await _getMyPaymentsHandler.HandleAsync(
                customerId);

        return Ok(result);
    }
}