using Application.Features.WebSiteAdmin.About.Create.DTOs;

namespace Application.Features.WebSiteAdmin.About.Create.Interfaces;

public interface ICreateAboutPageSectionHandler
{
    Task<CreateAboutPageSectionResponseDto> HandleAsync(
        CreateAboutPageSectionRequestDto request);
}