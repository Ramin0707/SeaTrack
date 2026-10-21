using Application.Features.PublicWebsite.Home.Get.DTOs;

namespace Application.Features.PublicWebsite.Home.Get.Interfaces;

public interface IGetPublicHomePageHandler
{
    Task<GetPublicHomePageResponseDto?> HandleAsync();
}