using Application.Features.WebSiteAdmin.About.Get.DTOs;

namespace Application.Features.WebSiteAdmin.About.Get.Interfaces;

public interface IGetAboutPageHandler
{
    Task<GetAboutPageResponseDto> HandleAsync();
}