using AcrovisPortal.Api.Models;
using AcrovisPortal.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AcrovisPortal.Api.Controllers;

[ApiController]
[Route("api/navigation")]
public sealed class NavigationController(INavigationRepository repository) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<NavigationItem>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<NavigationItem>>> Get(
        CancellationToken cancellationToken)
    {
        var items = await repository.GetNavigationAsync(cancellationToken);
        return Ok(items);
    }
}
