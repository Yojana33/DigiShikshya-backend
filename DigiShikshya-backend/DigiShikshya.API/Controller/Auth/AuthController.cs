using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class AuthController : ControllerBase
{
    private readonly KeycloakService _authService;

    public AuthController(KeycloakService authService)
    {
        _authService = authService;

    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var token = await _authService.AuthenticateAsync(loginRequest.Username!, loginRequest.Password!);

        if (token.Item1 == null && token.Item2 == null)
        {
            return Unauthorized();
        }

        var userData = JwtTokenHelper.GetTokenInfo(token.Item1!);
        await _authService.RegisterAsync(userData.Id!);
        Response.Cookies.Append("AccessToken", token.Item1!, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Set to true in production
            SameSite = SameSiteMode.Strict
        });

        Response.Cookies.Append("RefreshToken", token.Item2, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Set to true in production
            SameSite = SameSiteMode.None
        });
        return Ok(new { AccessToken = token.Item1, RefreshToken = token.Item2, Info = userData });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["RefreshToken"];
        var result = await _authService.LogoutAsync(refreshToken!);

        if (!result)
        {
            return BadRequest();
        }

        Response.Cookies.Delete("AccessToken");
        Response.Cookies.Delete("RefreshToken");
        return Ok();
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["RefreshToken"];
        var token = await _authService.GetNewAccessByRefreshToken(refreshToken!);

        if (token.Item1 == null)
        {
            return Unauthorized();
        }

        var userData = JwtTokenHelper.GetTokenInfo(token.Item1!);
        await _authService.RegisterAsync(userData.Id!);
        Response.Cookies.Append("AccessToken", token.Item1!, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Set to true in production
            SameSite = SameSiteMode.Strict
        });

        Response.Cookies.Append("RefreshToken", token.Item2, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Set to true in production
            SameSite = SameSiteMode.Strict
        });
        return Ok(new { AccessToken = token.Item1, RefereshToken = token.Item2, Info = userData });
    }

}

public class LoginRequest
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
