using Application.Features.WebSiteAdmin.Home.Create.DTOs;

namespace Application.Features.WebSiteAdmin.Home.Create.Interfaces;

public interface ICreateHomePageSectionHandler
{
    Task<CreateHomePageSectionResponseDto> HandleAsync(
        CreateHomePageSectionRequestDto request);
}