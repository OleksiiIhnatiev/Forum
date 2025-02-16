using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetMainComments;

public record GetMainCommentsQuery : IRequest<IReadOnlyList<GetMainCommentsQueryDto>>;
