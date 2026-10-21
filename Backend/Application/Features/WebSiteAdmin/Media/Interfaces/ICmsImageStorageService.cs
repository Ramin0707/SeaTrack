using Application.Features.WebSiteAdmin.Media.DTOs;

namespace Application.Features.WebSiteAdmin.Media.Interfaces;

public interface ICmsImageStorageService
{
    Task<UploadCmsImageResponseDto> UploadAsync(
        Stream fileStream,
        string originalFileName,
        string contentType,
        long fileSize);

    Task<bool> DeleteAsync(string imageUrl);
}
