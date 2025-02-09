using Forum.Application.CQRS.Dtos.Queries;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;
public record GetCommentWithRepliesQuery(Guid CommentId) : IRequest<CommentWithRepliesDto?>;
