using Forum.Domain.CommentAgregate;

namespace Forum.Application.Interfaces.Repositories;

public interface ICommentRepository
{
    Task CreateAsync(Comment comment, CancellationToken cancellationToken);
}
