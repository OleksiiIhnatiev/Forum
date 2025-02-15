using Microsoft.AspNetCore.Identity;

namespace Forum.Domain;

public class User : IdentityUser<Guid>
{
    // todo ai why ?. remove?
    public string? AvatarUrl { get; set; }
    public List<Comment> Comments { get; set; } = new();
}