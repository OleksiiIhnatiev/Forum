using AutoMapper;
using Forum.Application.Interfaces.Repositories;
using Forum.Domain.CommentAgregate;
using MediatR;

namespace Forum.Application.CQRS.Commands.Comments.CreateComment;

public class CreateCommentCommandHandler(ICommentRepository commentRepository, IMapper mapper)
    : IRequestHandler<CreateCommentCommand>
{
    public async Task Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        string? imageLink = null;

        if (request.ImgFile != null && request.ImgFile.Length > 0)
        {
            var fileName = $"{Guid.NewGuid()}_{request.ImgFile.FileName}";
            var imagesFolderPath = Path.Combine("wwwroot", "images");

            if (!Directory.Exists(imagesFolderPath))
            {
                Directory.CreateDirectory(imagesFolderPath);
            }

            var filePath = Path.Combine(imagesFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.ImgFile.CopyToAsync(stream);
            }

            imageLink = Path.Combine("images", fileName).Replace("\\", "/");
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
