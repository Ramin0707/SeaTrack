namespace Application.Features.Logistics.Vessels.Delete.Interfaces;

public interface IDeleteVesselHandler
{
    Task<bool> HandleAsync(int id);
}