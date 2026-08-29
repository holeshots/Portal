namespace AcrovisPortal.Api.Models;

public sealed record NavigationItem(
    string Id,
    string Label,
    string Path,
    string Icon,
    string Section,
    string? Badge = null,
    IReadOnlyList<NavigationItem>? Children = null);
