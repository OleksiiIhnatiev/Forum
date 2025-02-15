namespace Forum.Domain;
public class Comment
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    // todo ai move = DateTime.UtcNow; into ForumContext
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string? HomePage { get; set; }
    public string? ImgLink { get; set; }

    public Guid? ParentCommentId { get; set; }
    // todo ai why ?. remove everywhere if it's not needed
    public Comment? ParentComment { get; set; }

    public List<Comment> Replies { get; set; } = new();
}
