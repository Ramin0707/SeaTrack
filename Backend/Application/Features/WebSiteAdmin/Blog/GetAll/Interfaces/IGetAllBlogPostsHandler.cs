using Application.Features.WebSiteAdmin.Blog.GetAll.DTOs;

namespace Application.Features.WebSiteAdmin.Blog.GetAll.Interfaces;

public interface IGetAllBlogPostsHandler
{
    Task<List<GetAllBlogPostsResponseDto>> HandleAsync();
}