using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

public class AuthController : ControllerBase
{
    private readonly KeycloakService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IMediator _mediator;

    public AuthController(KeycloakService authService,  ILogger<AuthController> logger , IMediator mediator)
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

            if (token.Item1 == null || token.Item2 == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var userData = JwtTokenHelper.GetTokenInfo(token.Item1);
            var user = new AddUserCommand { Id = userData.Id! };
            await _mediator.Send(user);

            // Set the tokens as HttpOnly cookies
            SetTokenCookies(token.AccessToken, token.RefreshToken);

            return Ok(new { Info = userData, token.AccessToken, token.RefreshToken }); // Return user info without tokens if using cookies
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
        if (refreshToken == null)
        {
            return BadRequest("No refresh token found.");
        }

        var result = await _authService.LogoutAsync(refreshToken!);
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

            var token = await _authService.GetNewAccessByRefreshTokenAsync(refreshToken!);
            if (token.AccessToken == null || token.RefreshToken == null)
            {
                // Clear cookies if the refresh token is invalid
                Response.Cookies.Delete("AccessToken");
                Response.Cookies.Delete("RefreshToken");
                return Unauthorized("Invalid refresh token.");
            }

            var userData = JwtTokenHelper.GetTokenInfo(token.Item1);
            // await _authService.RegisterAsync(userData.Id!);

            // Set the new tokens as HttpOnly cookies
            SetTokenCookies(token.Item1, token.Item2);

            return Ok(new { Info = userData });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh.");
            return StatusCode(500, "An error occurred while refreshing the token.");
        }
    }

    [HttpGet("user/{role}")]
    public async Task<IActionResult> GetUser(string role)
    {
        var accessToken = Request.Cookies["AccessToken"];
        if (string.IsNullOrEmpty(accessToken))
        {
            return Unauthorized("Access token is missing.");
        }

        var userData = JwtTokenHelper.GetTokenInfo(accessToken);
        if (userData == null)
        {
            return Unauthorized("Invalid access token.");
        }

        var user = await _authService.GetUsersByRoleAsync(role);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        return Ok(user);
    }

    // Helper method to set access and refresh tokens in HttpOnly cookies
    private void SetTokenCookies(string accessToken, string refreshToken)
    {
        var accessTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Ensure this is true in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(1) // Adjust expiration to match token lifetime
        };

        Response.Cookies.Append("AccessToken", accessToken, accessTokenOptions);

        var refreshTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Ensure this is true in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7) // Longer expiration for refresh token
        };

        Response.Cookies.Append("RefreshToken", refreshToken, refreshTokenOptions);
    }
}

public class LoginRequest
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
