using AcrovisPortal.Api.Models;

namespace AcrovisPortal.Api.Repositories;

public interface INavigationRepository
{
    Task<IReadOnlyList<NavigationItem>> GetNavigationAsync(
        CancellationToken cancellationToken = default);
}
