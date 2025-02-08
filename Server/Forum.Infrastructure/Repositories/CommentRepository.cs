using Forum.Application.Interfaces.Repositories;
using Forum.Domain.CommentAgregate;
using Forum.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Forum.Infrastructure.Repositories;

public class CommentRepository(ForumContext context) : ICommentRepository
{
    public async Task CreateAsync(Comment comment, CancellationToken cancellationToken)
    {
        await context.Comments.AddAsync(comment, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
    public async Task<IReadOnlyList<Comment>> GetMainCommentsAsync(CancellationToken cancellationToken)
    {
        return await context.Comments
            .Include(c => c.User)
            .Where(c => c.ParentCommentId == null)
            .ToListAsync(cancellationToken);
    }

}
