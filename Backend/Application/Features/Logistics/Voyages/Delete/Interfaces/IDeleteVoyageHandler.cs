namespace Application.Features.Logistics.Voyages.Delete.Interfaces;

public interface IDeleteVoyageHandler
{
    Task<bool> HandleAsync(int id);
}