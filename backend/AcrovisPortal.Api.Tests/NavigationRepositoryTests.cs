using AcrovisPortal.Api.Repositories;

namespace AcrovisPortal.Api.Tests;

public sealed class NavigationRepositoryTests
{
    [Fact]
    public async Task GetNavigationAsync_ReturnsDashboardFirstAndGroupsPages()
    {
        var repository = new InMemoryNavigationRepository();

        var navigation = await repository.GetNavigationAsync();

        Assert.Equal("Dashboard", navigation[0].Label);
        Assert.Equal("/", navigation[0].Path);
        Assert.Contains(navigation, item =>
            item.Id == "devices" && item.Label == "Devices" && item.Path == "/devices");
        Assert.DoesNotContain(navigation, item => item.Id == "orders");
        Assert.Contains(navigation, item =>
            item.Id == "clients" && item.Label == "Clients" && item.Path == "/clients");
        Assert.DoesNotContain(navigation, item => item.Id == "customers");
        Assert.Contains(navigation, item => item.Section == "Management");
        Assert.All(navigation, item => Assert.Null(item.Badge));
    }

    [Fact]
    public async Task GetNavigationAsync_ReturnsAReadOnlyCollection()
    {
        var repository = new InMemoryNavigationRepository();

        var navigation = await repository.GetNavigationAsync();

        Assert.IsAssignableFrom<IReadOnlyList<Models.NavigationItem>>(navigation);
        Assert.All(navigation, item => Assert.False(string.IsNullOrWhiteSpace(item.Icon)));
    }
}
