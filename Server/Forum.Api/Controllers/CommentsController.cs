using Forum.Application.CQRS.Commands.Comments.CreateComment;
using Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;
using Forum.Application.CQRS.Queries.Comments.GetMainComments;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Forum.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostComment([FromForm] CreateCommentCommand command, CancellationToken cancellationToken)
    {
        await mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpGet("main-comments")]
    public async Task<IActionResult> GetMainComments(CancellationToken cancellationToken)
    {
        var comments = await mediator.Send(new GetMainCommentsQuery(), cancellationToken);
        return Ok(comments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCommentWithReplies(Guid id, CancellationToken cancellationToken)
    {
        var comment = await mediator.Send(new GetCommentWithRepliesQuery(id), cancellationToken);
        return comment is not null ? Ok(comment) : NotFound();
    }
}
