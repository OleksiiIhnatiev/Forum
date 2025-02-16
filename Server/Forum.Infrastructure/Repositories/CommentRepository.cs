using Forum.Application.Interfaces.Repositories;
using Forum.Domain;
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

    public async Task<IReadOnlyList<Comment>> GetMainCommentsAsync(
        CancellationToken cancellationToken
    )
    {
        return await context
            .Comments.Include(c => c.User)
            .Where(c => c.ParentCommentId == null)
            .ToListAsync(cancellationToken);
    }

    public async Task<Comment?> GetCommentWithRepliesAsync(
        Guid commentId,
        CancellationToken cancellationToken
    )
    {
        var comments = await context.Comments.Include(c => c.User).ToListAsync(cancellationToken);

        return BuildCommentTree(comments, commentId);
    }

    private Comment? BuildCommentTree(List<Comment> comments, Guid parentId)
    {
        var root = comments.FirstOrDefault(c => c.Id == parentId);
        if (root == null)
            return null;

        root.Replies = comments
            .Where(c => c.ParentCommentId == root.Id)
            .Select(c => BuildCommentTree(comments, c.Id))
            .Where(c => c != null)
            .ToList()!;
        return root;
    }
}
