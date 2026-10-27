using Application.Features.PublicWebsite.Services.Get.DTOs;

namespace Application.Features.PublicWebsite.Services.Get.Interfaces;

public interface IGetPublicServicesPageHandler
{
    Task<GetPublicServicesPageResponseDto?> HandleAsync();
}