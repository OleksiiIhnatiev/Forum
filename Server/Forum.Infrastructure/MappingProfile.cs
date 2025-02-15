using AutoMapper;
using Forum.Application.CQRS.Commands.Comments.CreateComment;
using Forum.Application.CQRS.Dtos.Queries;
using Forum.Domain.CommentAgregate;

namespace Forum.Infrastructure;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateCommentCommand, Comment>();

        CreateMap<Comment, GetMainCommentsDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));

        CreateMap<Comment, CommentWithRepliesDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.User.AvatarUrl))
            .ForMember(dest => dest.ImgLink, opt => opt.MapFrom(src => src.ImgLink))
            .ForMember(dest => dest.Replies, opt => opt.MapFrom(src => src.Replies));
    }
}
