using Application.Features.PublicWebsite.Blog.GetPublished.DTOs;

namespace Application.Features.PublicWebsite.Blog.GetPublished.Interfaces;

public interface IGetPublishedBlogPostsHandler
{
    Task<List<GetPublishedBlogPostsResponseDto>> HandleAsync();
}