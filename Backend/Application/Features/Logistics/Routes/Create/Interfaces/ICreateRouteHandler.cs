using Application.Features.Logistics.Routes.Create.DTOs;

namespace Application.Features.Logistics.Routes.Create.Interfaces;

public interface ICreateRouteHandler
{
    Task<CreateRouteResponseDto?> HandleAsync(
        CreateRouteRequestDto request);
}