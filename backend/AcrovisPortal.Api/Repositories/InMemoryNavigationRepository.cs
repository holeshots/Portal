using AcrovisPortal.Api.Models;

namespace AcrovisPortal.Api.Repositories;

public sealed class InMemoryNavigationRepository : INavigationRepository
{
    private static readonly IReadOnlyList<NavigationItem> Items =
    [
        new("dashboard", "Dashboard", "/", "grid", "Overview"),
        new("tickets", "Tickets", "/tickets", "activity", "Overview"),
        new("devices", "Devices", "/devices", "shopping-bag", "Management"),
        new("clients", "Clients", "/clients", "users", "Management"),
        new("microsoft365", "Microsoft 365", "/365", "package", "Management"),
        new("reports", "Reports", "/reports", "bar-chart", "Workspace"),
        new("messages", "Messages", "/messages", "message-square", "Workspace"),
        new("settings", "Settings", "/settings", "settings", "Workspace")
    ];

    public Task<IReadOnlyList<NavigationItem>> GetNavigationAsync(
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(Items);
    }
}
