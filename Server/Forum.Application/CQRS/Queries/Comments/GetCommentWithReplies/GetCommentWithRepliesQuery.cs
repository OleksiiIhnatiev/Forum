using Forum.Application.CQRS.Dtos.Queries;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;
// todo ai remove ? in CommentWithRepliesDto? and check everywhere in project
public record GetCommentWithRepliesQuery(Guid CommentId) : IRequest<CommentWithRepliesDto?>;
