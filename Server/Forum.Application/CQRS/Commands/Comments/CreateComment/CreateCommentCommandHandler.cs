using AutoMapper;
using Forum.Application.Interfaces.Repositories;
using Forum.Domain.CommentAgregate;
using MediatR;

namespace Forum.Application.CQRS.Commands.Comments.CreateComment;

public class CreateCommentCommandHandler(ICommentRepository repository, IMapper mapper)
    : IRequestHandler<CreateCommentCommand>
{
    public async Task Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = mapper.Map<Comment>(request);
        await repository.CreateAsync(comment, cancellationToken);
    }
}
