using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Forum.Application.Interfaces.Repositories;
using Forum.Infrastructure.Database;
using Forum.Domain;

namespace Forum.Infrastructure.Repositories;

public class AuthRepository(UserManager<User> userManager, ForumContext context) : IAuthRepository
{
    public async Task<User> FindByEmailAsync(string email, CancellationToken cancellationToken)
    {
        // todo ai what if there is no user by email? handle this case
        return await userManager.FindByEmailAsync(email);
    }

    // todo ai move business logic to new created service. consider AuthService. Repository should be responsible only for working with db
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
