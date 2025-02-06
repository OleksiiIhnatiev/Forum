using Forum.Application.CQRS.Commands.Comments.CreateComment;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Forum.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostComment([FromBody] CreateCommentCommand command, CancellationToken cancellationToken)
    {
        await mediator.Send(command, cancellationToken);
        return Ok();
    }
}