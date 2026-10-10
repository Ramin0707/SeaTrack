using Application.Features.Logistics.Routes.GetById.DTOs;
using Application.Features.Logistics.Routes.Update.DTOs;

namespace Application.Features.Logistics.Routes.Update.Interfaces;

public interface IUpdateRouteHandler
{
    Task<GetRouteByIdResponseDto?> HandleAsync(
        int id,
        UpdateRouteRequestDto request);
}