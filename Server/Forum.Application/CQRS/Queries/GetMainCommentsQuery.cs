using Forum.Application.CQRS.Dtos.Queries;
using MediatR;

namespace Forum.Application.CQRS.Queries;
public record GetMainCommentsQuery : IRequest<IReadOnlyList<GetMainCommentsDto>>;
