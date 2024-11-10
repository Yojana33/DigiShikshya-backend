using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IKeycloakService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IMediator _mediator;

    public AuthController(IKeycloakService authService, ILogger<AuthController> logger, IMediator mediator)
    {
        _authService = authService;
        _logger = logger;
        _mediator = mediator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var token = await _authService.AuthenticateAsync(loginRequest.Username!, loginRequest.Password!);

            if (string.IsNullOrEmpty(token.AccessToken) || string.IsNullOrEmpty(token.RefreshToken))
            {
                return Unauthorized("Invalid credentials");
            }

            var userData = JwtTokenHelper.GetTokenInfo(token.AccessToken);
            var user = new AddUserCommand { Id = userData.Id! };
            await _mediator.Send(user);

            // Set the tokens as HttpOnly cookies
            SetTokenCookies(token.AccessToken, token.RefreshToken);

            return Ok(new { Info = userData , AcessToken = token.AccessToken, token.RefreshToken});
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login.");
            return StatusCode(500, "An error occurred during login.");
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["RefreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest("No refresh token found.");
        }

        var result = await _authService.LogoutAsync(refreshToken);
        if (!result)
        {
            return BadRequest("Logout failed.");
        }

        Response.Cookies.Delete("AccessToken");
        Response.Cookies.Delete("RefreshToken");

        return Ok("Logout successful.");
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        try
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Refresh token is missing.");
            }

            var token = await _authService.GetNewAccessByRefreshTokenAsync(refreshToken);
            if (string.IsNullOrEmpty(token.AccessToken) || string.IsNullOrEmpty(token.RefreshToken))
            {
                Response.Cookies.Delete("AccessToken");
                Response.Cookies.Delete("RefreshToken");
                return Unauthorized("Invalid refresh token.");
            }

            var userData = JwtTokenHelper.GetTokenInfo(token.AccessToken);
            SetTokenCookies(token.AccessToken, token.RefreshToken);

            return Ok(new { Info = userData });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh.");
            return StatusCode(500, "An error occurred while refreshing the token.");
        }
    }

    [HttpGet("users/{role}")]
    public async Task<IActionResult> GetUsersByRole(string role)
    {
        try
        {
            var accessToken = Request.Cookies["AccessToken"];
            if (string.IsNullOrEmpty(accessToken))
            {
                return Unauthorized("Access token is missing.");
            }

            var users = await _authService.GetUsersByRoleAsync(role);
            if (users == null || !users.Any())
            {
                return NotFound("No users found for the specified role.");
            }

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users by role.");
            return StatusCode(500, "An error occurred while fetching users.");
        }
    }

    private void SetTokenCookies(string accessToken, string refreshToken)
    {
        var accessTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(1)
        };

        Response.Cookies.Append("AccessToken", accessToken, accessTokenOptions);

        var refreshTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("RefreshToken", refreshToken, refreshTokenOptions);
    }
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        try
        {
            var user = await _authService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user by ID.");
            return StatusCode(500, "An error occurred while fetching the user.");
        }
    }
}

public class LoginRequest
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
