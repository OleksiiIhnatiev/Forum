using AutoMapper;
using Forum.Application.Interfaces.Repositories;
using Forum.Application.Interfaces.Services;
using Forum.Domain;
using MediatR;

namespace Forum.Application.CQRS.Commands.Comments.CreateComment;

public class CreateCommentCommandHandler(
    ICommentRepository commentRepository,
    IMapper mapper,
    IFileService fileService
) : IRequestHandler<CreateCommentCommand>
{
    public async Task Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        string? fileLink = null;

        if (request.MessageFile != null && request.MessageFile.Length > 0)
        {
            var fileExtension = Path.GetExtension(request.MessageFile.FileName).ToLower();
            string folderPath = string.Empty;

            if (fileExtension == ".jpg" || fileExtension == ".jpeg" || fileExtension == ".png")
            {
                folderPath = Path.Combine("wwwroot", "images");
            }
            else if (fileExtension == ".gif")
            {
                folderPath = Path.Combine("wwwroot", "gifs");
            }
            else if (fileExtension == ".txt")
            {
                folderPath = Path.Combine("wwwroot", "texts");
            }

            if (!string.IsNullOrEmpty(folderPath))
            {
                Directory.CreateDirectory(folderPath);
                fileLink = await fileService.SaveFileAsync(request.MessageFile, folderPath);
            }
        }

        var comment = mapper.Map<Comment>(request);

        if (!string.IsNullOrEmpty(fileLink))
        {
            comment.FileLink = fileLink;
        }

        if (!string.IsNullOrEmpty(request.HomePage))
        {
            comment.HomePage = request.HomePage;
        }

        await commentRepository.CreateAsync(comment, cancellationToken);
    }
}
