namespace Application.Features.Logistics.Containers.Delete.Interfaces;

public interface IDeleteContainerHandler
{
    Task<bool> HandleAsync(int id);
}