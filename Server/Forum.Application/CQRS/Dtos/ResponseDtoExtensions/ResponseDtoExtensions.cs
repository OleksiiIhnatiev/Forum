using Forum.Application.CQRS.Dtos.Commands;

namespace Forum.Application.CQRS.Dtos.ResponseDtoExtensions
{
    public static class ResponseDtoExtensions
    {
        public static ResponseDto CreateResult(
            this ResponseDto _,
            bool success,
            string errorMessage = null,
            string token = null
        )
        {
            return new ResponseDto(success, errorMessage, token);
        }
    }
}
