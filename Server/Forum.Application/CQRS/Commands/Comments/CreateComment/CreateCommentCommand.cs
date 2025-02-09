using MediatR;
using Microsoft.AspNetCore.Http;

namespace Forum.Application.CQRS.Commands.Comments.CreateComment;

public record CreateCommentCommand(Guid UserId, string Text, Guid? ParentCommentId, IFormFile? ImgFile) : IRequest;
