using AutoMapper;
using Forum.Application.CQRS.Dtos.Queries;
using Forum.Application.Interfaces.Repositories;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;
public class GetCommentWithRepliesQueryHandler : IRequestHandler<GetCommentWithRepliesQuery, CommentWithRepliesDto?>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IMapper _mapper;

    public GetCommentWithRepliesQueryHandler(ICommentRepository commentRepository, IMapper mapper)
    {
        _commentRepository = commentRepository;
        _mapper = mapper;
    }

    public async Task<CommentWithRepliesDto?> Handle(GetCommentWithRepliesQuery request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetCommentWithRepliesAsync(request.CommentId, cancellationToken);
        return comment is not null ? _mapper.Map<CommentWithRepliesDto>(comment) : null;
    }
}
