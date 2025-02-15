using Forum.Application.CQRS.Dtos.Queries;
using MediatR;

namespace Forum.Application.CQRS.Queries.Comments.GetMainComments;
public record GetMainCommentsQuery : IRequest<IReadOnlyList<GetMainCommentsDto>>;
