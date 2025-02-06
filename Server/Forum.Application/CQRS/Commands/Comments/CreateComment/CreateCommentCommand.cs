using MediatR;

namespace Forum.Application.CQRS.Commands.Comments.CreateComment;

public record CreateCommentCommand(Guid UserId, string Text, Guid? ParentCommentId) : IRequest;
