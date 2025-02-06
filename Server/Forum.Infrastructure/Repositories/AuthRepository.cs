using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Forum.Application.Interfaces.Repositories;
using Forum.Domain.UserAggregate;
using Forum.Infrastructure.Database;

namespace Forum.Infrastructure.Repositories;

public class AuthRepository(UserManager<User> userManager, ForumContext context) : IAuthRepository
{
    public async Task<User> FindByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await userManager.FindByEmailAsync(email);
    }

    public async Task<IdentityResult> RemoveTokenAsync(string token, CancellationToken cancellationToken)
    {
        var userToken = await context.UserTokens.FirstOrDefaultAsync(z => z.Value == token, cancellationToken);

        if (userToken == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Token not found." });
        }

        context.UserTokens.Remove(userToken);

        await context.SaveChangesAsync(cancellationToken);

        return IdentityResult.Success;
    }
}
