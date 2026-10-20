using Application.Features.WebSiteAdmin.Blog.Create.DTOs;

namespace Application.Features.WebSiteAdmin.Blog.Create.Interfaces;

public interface ICreateBlogPostHandler
{
    Task<CreateBlogPostResponseDto> HandleAsync(
        CreateBlogPostRequestDto request);
}