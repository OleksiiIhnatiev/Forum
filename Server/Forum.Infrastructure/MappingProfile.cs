using AutoMapper;
using Forum.Application.CQRS.Commands.Comments.CreateComment;
using Forum.Domain.CommentAgregate;

namespace Forum.Infrastructure;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateCommentCommand, Comment>();
    }
}
