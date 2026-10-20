namespace Application.Features.WebSiteAdmin.Blog.Delete.Interfaces;

public interface IDeleteBlogPostHandler
{
    Task<bool> HandleAsync(int id);
}