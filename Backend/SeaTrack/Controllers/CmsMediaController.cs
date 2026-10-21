using Application.Features.WebSiteAdmin.Media.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/admin/cms/media")]
[Authorize(Roles = "Admin")]
public class CmsMediaController : ControllerBase
{
    private readonly ICmsImageStorageService
        _imageStorageService;

    public CmsMediaController(
        ICmsImageStorageService imageStorageService)
    {
        _imageStorageService = imageStorageService;
    }


    // =========================================================
    // POST: /api/admin/cms/media/images
    // =========================================================

    [HttpPost("images")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(
        IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new
            {
                message = "Please select an image file."
            });
        }

        try
        {
            await using var stream =
                file.OpenReadStream();

            var result =
                await _imageStorageService.UploadAsync(
                    stream,
                    file.FileName,
                    file.ContentType,
                    file.Length);

            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (IOException exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = exception.Message
                });
        }
    }


    // =========================================================
    // DELETE:
    // /api/admin/cms/media/images?imageUrl=...
    // =========================================================

    [HttpDelete("images")]
    public async Task<IActionResult> DeleteImage(
        [FromQuery] string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return BadRequest(new
            {
                message = "Image URL is required."
            });
        }

        try
        {
            var deleted =
                await _imageStorageService.DeleteAsync(
                    imageUrl);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "Image was not found."
                });
            }

            return Ok(new
            {
                message = "Image deleted successfully.",
                imageUrl
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (IOException exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = exception.Message
                });
        }
    }
}