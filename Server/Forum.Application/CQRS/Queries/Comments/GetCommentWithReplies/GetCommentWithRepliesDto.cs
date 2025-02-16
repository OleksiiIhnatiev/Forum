namespace Forum.Application.CQRS.Queries.Comments.GetCommentWithReplies;

public class GetCommentWithRepliesDto
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? HomePage { get; set; }
    public string UserName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? ImgLink { get; set; }

    // note ai We don't remove the initialization of the list because this prevents the need to check for `null` before adding elements and simplifies the collection by ensuring that the list always exists (albeit empty) and not `null`.
    public List<GetCommentWithRepliesDto> Replies { get; set; } = new();
}
