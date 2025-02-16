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
        string? imageLink = null;

        if (request.ImgFile != null && request.ImgFile.Length > 0)
        {
            var imagesFolderPath = Path.Combine("wwwroot", "images");
            imageLink = await fileService.SaveFileAsync(request.ImgFile, imagesFolderPath);
        }

        var comment = mapper.Map<Comment>(request);

        if (!string.IsNullOrEmpty(imageLink))
        {
            comment.ImgLink = imageLink;
        }

        if (!string.IsNullOrEmpty(request.HomePage))
        {
            comment.HomePage = request.HomePage;
        }

        await commentRepository.CreateAsync(comment, cancellationToken);
    }
}
