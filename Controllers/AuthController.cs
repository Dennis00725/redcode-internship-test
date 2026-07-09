using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    public record RegisterDto(string Username, string Password);
    public record LoginDto(string Username, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (db.Users.Any(u => u.Username == dto.Username))
            return BadRequest("Username already taken.");

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Ok(new { token = tokenService.CreateToken(user) });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = db.Users.FirstOrDefault(u => u.Username == dto.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        return Ok(new { token = tokenService.CreateToken(user) });
    }
}