using Application.Features.Logistics.Routes.GetById.DTOs;

namespace Application.Features.Logistics.Routes.GetById.Interfaces;

public interface IGetRouteByIdHandler
{
    Task<GetRouteByIdResponseDto?> HandleAsync(int id);
}