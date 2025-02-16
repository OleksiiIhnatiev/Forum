using AutoMapper;
using Forum.Application.CQRS.Commands.Comments.CreateComment;
using Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;
using Forum.Application.CQRS.Queries.Comments.GetMainComments;
using Forum.Domain;

namespace Forum.Infrastructure;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateCommentCommand, Comment>();

        CreateMap<Comment, GetMainCommentsQueryDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));

        CreateMap<Comment, GetCommentWithRepliesDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));
    }
}
