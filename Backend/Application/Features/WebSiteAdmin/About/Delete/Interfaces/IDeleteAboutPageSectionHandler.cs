namespace Application.Features.WebSiteAdmin.About.Delete.Interfaces;

public interface IDeleteAboutPageSectionHandler
{
    Task<bool> HandleAsync(int id);
}