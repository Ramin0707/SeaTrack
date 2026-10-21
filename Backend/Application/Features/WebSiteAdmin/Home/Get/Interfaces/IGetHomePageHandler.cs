using Application.Features.WebSiteAdmin.Home.Get.DTOs;

namespace Application.Features.WebSiteAdmin.Home.Get.Interfaces;

public interface IGetHomePageHandler
{
    Task<GetHomePageResponseDto> HandleAsync();
}