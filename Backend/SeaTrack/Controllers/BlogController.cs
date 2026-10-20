using Application.Features.PublicWebsite.Blog.GetPublished.DTOs;
using Application.Features.PublicWebsite.Blog.GetPublished.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/blog")]
[AllowAnonymous]
public class BlogController : ControllerBase
{
    private readonly IGetPublishedBlogPostsHandler
        _getPublishedBlogPostsHandler;

    public BlogController(
        IGetPublishedBlogPostsHandler getPublishedBlogPostsHandler)
    {
        _getPublishedBlogPostsHandler =
            getPublishedBlogPostsHandler;
    }


    // =========================
    // Get Published Blog Posts
    // =========================

    [HttpGet]
    public async Task<
        ActionResult<List<GetPublishedBlogPostsResponseDto>>> GetPublished()
    {
        var result =
            await _getPublishedBlogPostsHandler.HandleAsync();

        return Ok(result);
    }
}