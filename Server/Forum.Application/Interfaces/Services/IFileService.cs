using Microsoft.AspNetCore.Http;

namespace Forum.Application.Interfaces.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string folderPath);
}
