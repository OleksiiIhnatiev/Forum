using Microsoft.AspNetCore.Identity;

namespace Forum.Domain.UserAggregate;

public class User : IdentityUser<Guid>
{
}