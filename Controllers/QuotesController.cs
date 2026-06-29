using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuotesController(AppDbContext db) : ControllerBase
{
    private int UserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public IActionResult GetAll() =>
        Ok(db.Quotes.Where(q => q.UserId == UserId).ToList());

    [HttpPost]
    public async Task<IActionResult> Create(Quote quote)
    {
        quote.UserId = UserId;
        db.Quotes.Add(quote);
        await db.SaveChangesAsync();
        return Ok(quote);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Quote quote)
    {
        var existing = db.Quotes.FirstOrDefault(q => q.Id == id && q.UserId == UserId);
        if (existing is null) return NotFound();
        existing.Text = quote.Text;
        existing.Author = quote.Author;
        await db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = db.Quotes.FirstOrDefault(q => q.Id == id && q.UserId == UserId);
        if (book is null) return NotFound();
        db.Quotes.Remove(book);
        await db.SaveChangesAsync();
        return NoContent();
    }
}