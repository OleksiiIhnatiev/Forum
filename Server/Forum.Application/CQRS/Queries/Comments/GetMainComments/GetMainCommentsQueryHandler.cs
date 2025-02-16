using AutoMapper;
using Forum.Application.Interfaces.Repositories;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetMainComments;

public class GetMainCommentsQueryHandler(ICommentRepository commentRepository, IMapper mapper)
    : IRequestHandler<GetMainCommentsQuery, IReadOnlyList<GetMainCommentsQueryDto>>
{
    public async Task<IReadOnlyList<GetMainCommentsQueryDto>> Handle(
        GetMainCommentsQuery query,
        CancellationToken cancellationToken
    )
    {
        var mainComments = await commentRepository.GetMainCommentsAsync(cancellationToken);

        return mainComments
            .Select(comment => mapper.Map<GetMainCommentsQueryDto>(comment))
            .ToList();
    }
}
