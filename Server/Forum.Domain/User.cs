using Microsoft.AspNetCore.Identity;

namespace Forum.Domain;

public class User : IdentityUser<Guid>
{
    public List<Comment> Comments { get; set; } = new();
}
