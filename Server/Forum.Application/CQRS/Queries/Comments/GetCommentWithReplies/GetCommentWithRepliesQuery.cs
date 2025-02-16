using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;

public record GetCommentWithRepliesQuery(Guid CommentId) : IRequest<GetCommentWithRepliesDto>;
