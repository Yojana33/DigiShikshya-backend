using MediatR;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v1/course")]
public class CourseController(IMediator _mediator) : ControllerBase
{
    [HttpPost("add")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> AddCourse(AddNewCourse request)
    {
        var response = await _mediator.Send(request);

        return response.Status switch
        {
            "Success" => CreatedAtAction(nameof(AddCourse), response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

}