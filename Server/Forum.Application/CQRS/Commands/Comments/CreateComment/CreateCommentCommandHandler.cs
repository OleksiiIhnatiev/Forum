﻿using AutoMapper;
using Forum.Application.Interfaces.Repositories;
using Forum.Domain.CommentAgregate;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Forum.Application.CQRS.Commands.Comments.CreateComment;

public class CreateCommentCommandHandler(ICommentRepository repository, IMapper mapper)
    : IRequestHandler<CreateCommentCommand>
{
    public async Task Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        // Сохраняем файл изображения, если он передан
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

        // Маппируем команду в сущность Comment
        var comment = mapper.Map<Comment>(request);

        if (!string.IsNullOrEmpty(imageLink))
        {
            comment.ImgLink = imageLink; // Присваиваем путь к изображению
        }

        // Сохраняем комментарий в репозитории
        await repository.CreateAsync(comment, cancellationToken);
    }
}
