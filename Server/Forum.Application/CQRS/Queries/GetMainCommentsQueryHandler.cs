using AutoMapper;
using MediatR;
using Forum.Application.CQRS.Dtos.Queries;
using Forum.Application.Interfaces.Repositories;

namespace Forum.Application.CQRS.Queries.Comments.GetMainComments;
    public class GetMainCommentsQueryHandler : IRequestHandler<GetMainCommentsQuery, IReadOnlyList<GetMainCommentsDto>>
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IMapper _mapper;

        public GetMainCommentsQueryHandler(ICommentRepository commentRepository, IMapper mapper)
        {
            _commentRepository = commentRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<GetMainCommentsDto>> Handle(GetMainCommentsQuery request, CancellationToken cancellationToken)
        {
            var mainComments = await _commentRepository.GetMainCommentsAsync(cancellationToken);

            return mainComments
                .Select(comment => _mapper.Map<GetMainCommentsDto>(comment))
                .ToList();
        }
    }
