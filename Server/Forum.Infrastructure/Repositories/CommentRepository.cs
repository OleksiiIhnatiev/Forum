using Forum.Application.Interfaces.Repositories;
using Forum.Domain.CommentAgregate;
using Forum.Infrastructure.Database;

namespace Forum.Infrastructure.Repositories;

public class CommentRepository(ForumContext context) : ICommentRepository
{
    public async Task CreateAsync(Comment comment, CancellationToken cancellationToken)
    {
        await context.Comments.AddAsync(comment, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}
