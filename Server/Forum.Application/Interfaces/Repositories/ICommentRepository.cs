using Forum.Domain;

namespace Forum.Application.Interfaces.Repositories;

public interface ICommentRepository
{
    Task CreateAsync(Comment comment, CancellationToken cancellationToken);
    Task<IReadOnlyList<Comment>> GetMainCommentsAsync(CancellationToken cancellationToken);
    Task<Comment?> GetCommentWithRepliesAsync(Guid commentId, CancellationToken cancellationToken);
}
