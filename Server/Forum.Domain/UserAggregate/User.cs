using Forum.Domain.CommentAgregate;
using Microsoft.AspNetCore.Identity;

namespace Forum.Domain.UserAggregate;

public class User : IdentityUser<Guid>
{
    public string? AvatarUrl { get; set; }
    public List<Comment> Comments { get; set; } = new();
}