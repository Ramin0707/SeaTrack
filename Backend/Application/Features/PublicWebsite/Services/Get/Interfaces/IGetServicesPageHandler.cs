using Application.Features.WebSiteAdmin.Services.Get.DTOs;

namespace Application.Features.WebSiteAdmin.Services.Get.Interfaces;

public interface IGetServicesPageHandler
{
    Task<GetServicesPageResponseDto?> HandleAsync();
}