using Forum.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace Forum.Application.Services;

public class FileService : IFileService
{
    public async Task<string> SaveFileAsync(IFormFile file, string folderPath)
    {
        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var fullPath = Path.Combine(folderPath, fileName);

        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = fullPath.Replace("\\", "/").Replace("wwwroot/", "");

        return relativePath;
    }
}
