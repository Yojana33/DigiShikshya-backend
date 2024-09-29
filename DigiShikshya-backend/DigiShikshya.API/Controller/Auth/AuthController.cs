// using Microsoft.AspNetCore.Mvc;

// public class AuthController:ControllerBase 
// {
//     private readonly KeycloakService _authService;

//     public AuthController(KeycloakService authService)
//     {
//         _authService = authService;
       
//     }

//     [HttpPost("login")]
//     public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
//     {
//         var token = await _authService.AuthenticateAsync(loginRequest.Username, loginRequest.Password);

//         if (token == null)
//         {
//             return Unauthorized();
//         }

//         var userData = JwtTokenHelper.GetTokenInfo(token);

//         return Ok(new { Token = token, Info = userData });
//     }
    
// }