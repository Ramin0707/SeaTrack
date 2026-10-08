namespace Application.Features.Logistics.Berths.Delete.Interfaces;

public interface IDeleteBerthHandler
{
    Task<bool> HandleAsync(int id);
}