using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BooksController(AppDbContext db) : ControllerBase
{
    private int UserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public IActionResult GetAll() =>
        Ok(db.Books.Where(b => b.UserId == UserId).ToList());

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var book = db.Books.FirstOrDefault(b => b.Id == id && b.UserId == UserId);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Book book)
    {
        book.UserId = UserId;
        db.Books.Add(book);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Book book)
    {
        var existing = db.Books.FirstOrDefault(b => b.Id == id && b.UserId == UserId);
        if (existing is null) return NotFound();
        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.PublicationDate = book.PublicationDate;
        await db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = db.Books.FirstOrDefault(b => b.Id == id && b.UserId == UserId);
        if (book is null) return NotFound();
        db.Books.Remove(book);
        await db.SaveChangesAsync();
        return NoContent();
    }
}