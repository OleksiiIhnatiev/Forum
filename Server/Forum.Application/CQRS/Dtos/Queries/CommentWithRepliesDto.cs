namespace Forum.Application.CQRS.Dtos.Queries;

public class CommentWithRepliesDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? HomePage { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? ImgLink { get; set; } 
    public List<CommentWithRepliesDto> Replies { get; set; } = new();
}
