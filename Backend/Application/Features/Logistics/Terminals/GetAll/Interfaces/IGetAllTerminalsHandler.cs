using Application.Features.Logistics.Terminals.GetAll.DTOs;

namespace Application.Features.Logistics.Terminals.GetAll.Interfaces;

public interface IGetAllTerminalsHandler
{
    Task<List<GetAllTerminalsResponseDto>> HandleAsync();
}