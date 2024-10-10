using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/student-activity")]
public class StudentActivity(IMediator _mediator) :ControllerBase

{

    // [HttpGet("assignment-details")]
    // public async Task<IActionResult> GetAssignmentDetails(GetAssignmentDetailsQuery request)
    // {
    //     try
    //     {
    //         var response = await _mediator.Send(request);
    //         return Ok(response);
    //     }
    //     catch (Exception)
    //     {
    //         return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred. Please try again later." });
    //     }
    // }


}