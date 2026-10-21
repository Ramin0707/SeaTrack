using Application.Features.WebSiteAdmin.Media.DTOs;
using Application.Features.WebSiteAdmin.Media.Interfaces;

namespace SeaTrack.Services;

public class CmsImageStorageService : ICmsImageStorageService
{
    private const long MaxFileSize =
        5 * 1024 * 1024;

    private static readonly HashSet<string>
        AllowedExtensions =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            };

    private readonly IWebHostEnvironment _environment;

    public CmsImageStorageService(
        IWebHostEnvironment environment)
    {
        _environment = environment;
    }


    // =========================================================
    // UPLOAD
    // =========================================================

    public async Task<UploadCmsImageResponseDto> UploadAsync(
        Stream fileStream,
        string originalFileName,
        string contentType,
        long fileSize)
    {
        if (fileStream is null)
        {
            throw new ArgumentException(
                "Image file is required.");
        }

        if (fileSize <= 0)
        {
            throw new ArgumentException(
                "Image file is empty.");
        }

        if (fileSize > MaxFileSize)
        {
            throw new ArgumentException(
                "Image file cannot be larger than 5 MB.");
        }

        var originalExtension =
            Path.GetExtension(originalFileName)
                .ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(
                originalExtension) ||
            !AllowedExtensions.Contains(
                originalExtension))
        {
            throw new ArgumentException(
                "Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        using var memoryStream =
            new MemoryStream();

        await fileStream.CopyToAsync(
            memoryStream);

        if (memoryStream.Length == 0)
        {
            throw new ArgumentException(
                "Image file is empty.");
        }

        if (memoryStream.Length > MaxFileSize)
        {
            throw new ArgumentException(
                "Image file cannot be larger than 5 MB.");
        }

        var fileBytes =
            memoryStream.ToArray();


        // =====================================================
        // Detect real image type from file bytes
        // =====================================================

        var detectedImage =
            DetectImageType(fileBytes);

        if (detectedImage is null)
        {
            throw new ArgumentException(
                "The uploaded file is not a valid JPG, PNG or WEBP image.");
        }

        var actualExtension =
            detectedImage.Value.Extension;

        var actualContentType =
            detectedImage.Value.ContentType;


        // =====================================================
        // Resolve wwwroot
        // =====================================================

        var webRootPath =
            _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(
                webRootPath))
        {
            webRootPath = Path.Combine(
                _environment.ContentRootPath,
                "wwwroot");
        }


        // =====================================================
        // uploads/cms
        // =====================================================

        var uploadDirectory =
            Path.Combine(
                webRootPath,
                "uploads",
                "cms");

        Directory.CreateDirectory(
            uploadDirectory);


        // =====================================================
        // Generate safe unique file name
        // =====================================================

        var storedFileName =
            $"{Guid.NewGuid():N}{actualExtension}";

        var physicalFilePath =
            Path.Combine(
                uploadDirectory,
                storedFileName);


        // =====================================================
        // Save
        // =====================================================

        await File.WriteAllBytesAsync(
            physicalFilePath,
            fileBytes);


        // =====================================================
        // Public URL
        // =====================================================

        var imageUrl =
            $"/uploads/cms/{storedFileName}";


        return new UploadCmsImageResponseDto
        {
            FileName = storedFileName,
            ImageUrl = imageUrl,
            ContentType = actualContentType,
            Size = fileBytes.LongLength
        };
    }


    // =========================================================
    // DELETE
    // =========================================================

    public Task<bool> DeleteAsync(
        string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(
                imageUrl))
        {
            return Task.FromResult(false);
        }

        const string cmsUploadPrefix =
            "/uploads/cms/";

        if (!imageUrl.StartsWith(
                cmsUploadPrefix,
                StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(false);
        }

        var relativePart =
            imageUrl[cmsUploadPrefix.Length..];

        // Do not allow deleting files from nested folders,
        // for example /uploads/cms/default/...
        if (relativePart.Contains('/') ||
            relativePart.Contains('\\'))
        {
            return Task.FromResult(false);
        }

        var fileName =
            Path.GetFileName(relativePart);

        if (string.IsNullOrWhiteSpace(
                fileName))
        {
            return Task.FromResult(false);
        }

        var webRootPath =
            _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(
                webRootPath))
        {
            webRootPath = Path.Combine(
                _environment.ContentRootPath,
                "wwwroot");
        }

        var physicalFilePath =
            Path.Combine(
                webRootPath,
                "uploads",
                "cms",
                fileName);

        if (!File.Exists(
                physicalFilePath))
        {
            return Task.FromResult(false);
        }

        File.Delete(
            physicalFilePath);

        return Task.FromResult(true);
    }


    // =========================================================
    // IMAGE TYPE DETECTION
    // =========================================================

    private static (
        string Extension,
        string ContentType)?
        DetectImageType(byte[] bytes)
    {
        if (IsJpeg(bytes))
        {
            return (
                ".jpg",
                "image/jpeg");
        }

        if (IsPng(bytes))
        {
            return (
                ".png",
                "image/png");
        }

        if (IsWebP(bytes))
        {
            return (
                ".webp",
                "image/webp");
        }

        return null;
    }


    // =========================================================
    // JPEG
    // =========================================================

    private static bool IsJpeg(
        byte[] bytes)
    {
        return bytes.Length >= 4 &&
               bytes[0] == 0xFF &&
               bytes[1] == 0xD8 &&
               bytes[2] == 0xFF;
    }


    // =========================================================
    // PNG
    // =========================================================

    private static bool IsPng(
        byte[] bytes)
    {
        return bytes.Length >= 8 &&
               bytes[0] == 0x89 &&
               bytes[1] == 0x50 &&
               bytes[2] == 0x4E &&
               bytes[3] == 0x47 &&
               bytes[4] == 0x0D &&
               bytes[5] == 0x0A &&
               bytes[6] == 0x1A &&
               bytes[7] == 0x0A;
    }


    // =========================================================
    // WEBP
    // =========================================================

    private static bool IsWebP(
        byte[] bytes)
    {
        return bytes.Length >= 12 &&
               bytes[0] == 0x52 &&
               bytes[1] == 0x49 &&
               bytes[2] == 0x46 &&
               bytes[3] == 0x46 &&
               bytes[8] == 0x57 &&
               bytes[9] == 0x45 &&
               bytes[10] == 0x42 &&
               bytes[11] == 0x50;
    }
}