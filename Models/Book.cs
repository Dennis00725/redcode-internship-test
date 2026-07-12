namespace backend.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public DateTime PublicationDate { get; set; }
    public string Genre { get; set; } = string.Empty;
    public string ReadingStatus { get; set; } = "Want to Read";
    public int Rating { get; set; } = 0;
    public int UserId { get; set; }
}