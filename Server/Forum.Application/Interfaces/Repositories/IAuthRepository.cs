using Forum.Domain;
using Microsoft.AspNetCore.Identity;

namespace Forum.Application.Interfaces.Repositories;

public interface IAuthRepository
{
    Task<User> FindByEmailAsync(string email, CancellationToken cancellationToken);
    Task<IdentityResult> RemoveTokenAsync(string token, CancellationToken cancellationToken);
}
