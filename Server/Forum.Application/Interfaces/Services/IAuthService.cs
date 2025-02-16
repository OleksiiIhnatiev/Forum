using System.Threading;
using System.Threading.Tasks;
using Forum.Domain;
using Microsoft.AspNetCore.Identity;

namespace Forum.Application.Interfaces.Services;

public interface IAuthService
{
    Task<User> GetUserByEmailAsync(string email, CancellationToken cancellationToken);
    Task<IdentityResult> DeleteTokenAsync(string token, CancellationToken cancellationToken);
}
