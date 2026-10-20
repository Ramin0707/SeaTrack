using Application.Features.WebSiteAdmin.Blog.Update.DTOs;

namespace Application.Features.WebSiteAdmin.Blog.Update.Interfaces;

public interface IUpdateBlogPostHandler
{
    Task<UpdateBlogPostResponseDto?> HandleAsync(
        int id,
        UpdateBlogPostRequestDto request);
}