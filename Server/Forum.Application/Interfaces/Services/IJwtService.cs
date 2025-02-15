namespace Forum.Application.Interfaces.Services;

public interface IJwtService
{
    Task<string> GenerateJwtTokenAsync(Guid userId, string userName, string email);
}
