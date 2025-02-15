using AutoMapper;
using MediatR;
using Forum.Application.CQRS.Dtos.Queries;
using Forum.Application.Interfaces.Repositories;

namespace Forum.Application.CQRS.Queries.Comments.GetMainComments;
public class GetMainCommentsQueryHandler(ICommentRepository commentRepository, 
    IMapper mapper) : IRequestHandler<GetMainCommentsQuery, IReadOnlyList<GetMainCommentsDto>>
{
    public async Task<IReadOnlyList<GetMainCommentsDto>> Handle(GetMainCommentsQuery request, 
        CancellationToken cancellationToken)
    {
        var mainComments = await commentRepository.GetMainCommentsAsync(cancellationToken);

        return mainComments
            .Select(comment => mapper.Map<GetMainCommentsDto>(comment))
            .ToList();
    }
}
