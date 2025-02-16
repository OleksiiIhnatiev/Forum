using AutoMapper;
using Forum.Application.Interfaces.Repositories;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;

public class GetCommentWithRepliesQueryHandler(ICommentRepository commentRepository, IMapper mapper)
    : IRequestHandler<GetCommentWithRepliesQuery, GetCommentWithRepliesDto?>
{
    public async Task<GetCommentWithRepliesDto?> Handle(
        GetCommentWithRepliesQuery request,
        CancellationToken cancellationToken
    )
    {
        var comment = await commentRepository.GetCommentWithRepliesAsync(
            request.CommentId,
            cancellationToken
        );

        return mapper.Map<GetCommentWithRepliesDto>(comment);
    }
}
