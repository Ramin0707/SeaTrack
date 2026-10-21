using Application.Features.WebSiteAdmin.Home.Reorder.DTOs;

namespace Application.Features.WebSiteAdmin.Home.Reorder.Interfaces;

public interface IReorderHomePageSectionsHandler
{
    Task<ReorderHomePageSectionsResponseDto> HandleAsync(
        ReorderHomePageSectionsRequestDto request);
}