namespace Forum.Application.Interfaces.Services;

public interface IJwtService
{
    Task<string> GenerateJwtTokenAsync(string userName);
}
