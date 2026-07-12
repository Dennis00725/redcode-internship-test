using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    public record RegisterDto(string Username, string Password);
    public record LoginDto(string Username, string Password);
    public record ChangePasswordDto(string CurrentPassword, string NewPassword);

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

    [Authorize]
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = db.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound();
        return Ok(new { user.Id, user.Username });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = db.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return BadRequest("Current password is incorrect.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await db.SaveChangesAsync();
        return Ok(new { message = "Password changed successfully." });
    }
}