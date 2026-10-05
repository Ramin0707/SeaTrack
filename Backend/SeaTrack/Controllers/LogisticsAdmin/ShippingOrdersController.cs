using Application.Features.Shipping.LogisticsAdmin.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.GetById.DTOs;
using Application.Features.Shipping.LogisticsAdmin.GetById.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Quote.Create.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.Interfaces;
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

    public ShippingOrdersController(
        IGetAllShippingOrdersHandler getAllShippingOrdersHandler,
        IGetShippingOrderByIdHandler getShippingOrderByIdHandler,
        ICreateQuoteHandler createQuoteHandler,
        ICreateInvoiceHandler createInvoiceHandler)
    {
        _getAllShippingOrdersHandler = getAllShippingOrdersHandler;
        _getShippingOrderByIdHandler = getShippingOrderByIdHandler;
        _createQuoteHandler = createQuoteHandler;
        _createInvoiceHandler = createInvoiceHandler;
    }

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
}