using AutoMapper;
using Forum.Application.CQRS.Dtos.Queries;
using Forum.Application.Interfaces.Repositories;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;
public class GetCommentWithRepliesQueryHandler(ICommentRepository commentRepository, 
    IMapper mapper) : IRequestHandler<GetCommentWithRepliesQuery, CommentWithRepliesDto?>
{
    public async Task<CommentWithRepliesDto?> Handle(GetCommentWithRepliesQuery request, 
        CancellationToken cancellationToken)
    {
        var comment = await commentRepository.GetCommentWithRepliesAsync(request.CommentId, cancellationToken);
        return comment is not null ? mapper.Map<CommentWithRepliesDto>(comment) : null;
    }
}
