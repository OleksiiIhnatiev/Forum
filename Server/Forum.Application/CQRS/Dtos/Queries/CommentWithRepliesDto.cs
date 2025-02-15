namespace Forum.Application.CQRS.Dtos.Queries;

// todo ai move DTOs to commands and queries folders. 
// todo ai change DTOs names according to queries and commands names
public class CommentWithRepliesDto
{
    public Guid Id { get; set; }
    // todo ai why = string.Empty;? if it's not needed -> remove
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? HomePage { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? ImgLink { get; set; }
    // todo ai why = new();? if it's not needed -> remove
    public List<CommentWithRepliesDto> Replies { get; set; } = new();
}
