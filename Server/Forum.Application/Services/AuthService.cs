using Forum.Application.Interfaces.Repositories;
using Forum.Application.Interfaces.Services;
using Forum.Domain;
using Microsoft.AspNetCore.Identity;

namespace Forum.Application.Services;

public class AuthService(IAuthRepository authRepository, UserManager<User> userManager)
    : IAuthService
{
    public async Task<User> GetUserByEmailAsync(string email, CancellationToken cancellationToken)
    {
        // Можно добавить дополнительную бизнес-логику, если нужно
        var user = await authRepository.FindByEmailAsync(email, cancellationToken);
        if (user == null)
        {
            // Бизнес-логика для случая, если пользователь не найден
            throw new Exception("User not found.");
        }
        return user;
    }

    public async Task<IdentityResult> DeleteTokenAsync(
        string token,
        CancellationToken cancellationToken
    )
    {
        // Бизнес-логика перед удалением токена, например, проверки
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new ArgumentException("Token cannot be empty.");
        }

        var result = await authRepository.RemoveTokenAsync(token, cancellationToken);
        if (!result.Succeeded)
        {
            // Логика обработки ошибки, если удаление токена не удалось
            throw new Exception("Failed to remove token.");
        }

        return result;
    }
}
