using Application.Features.PublicWebsite.About.Get.DTOs;

namespace Application.Features.PublicWebsite.About.Get.Interfaces;

public interface IGetPublicAboutPageHandler
{
    Task<GetPublicAboutPageResponseDto?> HandleAsync();
}