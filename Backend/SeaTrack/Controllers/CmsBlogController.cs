using Application.Features.WebSiteAdmin.Blog.Create.DTOs;
using Application.Features.WebSiteAdmin.Blog.Create.Interfaces;
using Application.Features.WebSiteAdmin.Blog.Delete.Interfaces;
using Application.Features.WebSiteAdmin.Blog.GetAll.DTOs;
using Application.Features.WebSiteAdmin.Blog.GetAll.Interfaces;
using Application.Features.WebSiteAdmin.Blog.Update.DTOs;
using Application.Features.WebSiteAdmin.Blog.Update.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers;

[ApiController]
[Route("api/admin/cms/blog")]
[Authorize(Roles = "Admin")]
public class CmsBlogController : ControllerBase
{
    private readonly ICreateBlogPostHandler
        _createBlogPostHandler;

    private readonly IGetAllBlogPostsHandler
        _getAllBlogPostsHandler;

    private readonly IUpdateBlogPostHandler
        _updateBlogPostHandler;

    private readonly IDeleteBlogPostHandler
        _deleteBlogPostHandler;


    public CmsBlogController(
        ICreateBlogPostHandler createBlogPostHandler,
        IGetAllBlogPostsHandler getAllBlogPostsHandler,
        IUpdateBlogPostHandler updateBlogPostHandler,
        IDeleteBlogPostHandler deleteBlogPostHandler)
    {
        _createBlogPostHandler =
            createBlogPostHandler;

        _getAllBlogPostsHandler =
            getAllBlogPostsHandler;

        _updateBlogPostHandler =
            updateBlogPostHandler;

        _deleteBlogPostHandler =
            deleteBlogPostHandler;
    }


    // =========================
    // Get All Blog Posts
    // =========================

    [HttpGet]
    public async Task<
        ActionResult<List<GetAllBlogPostsResponseDto>>> GetAll()
    {
        var result =
            await _getAllBlogPostsHandler.HandleAsync();

        return Ok(result);
    }


    // =========================
    // Create Blog Post
    // =========================

    [HttpPost]
    public async Task<
        ActionResult<CreateBlogPostResponseDto>> Create(
        [FromBody] CreateBlogPostRequestDto request)
    {
        var result =
            await _createBlogPostHandler.HandleAsync(
                request
            );

        return Ok(result);
    }


    // =========================
    // Update Blog Post
    // =========================

    [HttpPut("{id:int}")]
    public async Task<
        ActionResult<UpdateBlogPostResponseDto>> Update(
        int id,
        [FromBody] UpdateBlogPostRequestDto request)
    {
        var result =
            await _updateBlogPostHandler.HandleAsync(
                id,
                request
            );

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    // =========================
    // Delete Blog Post
    // =========================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        int id)
    {
        var deleted =
            await _deleteBlogPostHandler.HandleAsync(
                id
            );

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}