using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v1/course")]
public class CourseController(IMediator _mediator) : ControllerBase
{
    [Authorize(Policy = "AdminPolicy")]
    [HttpPost("add")]
    public async Task<IActionResult> AddCourse([FromBody] AddNewCourse request)
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
    
    [HttpGet("all")]
    [Authorize(Policy = "StudentPolicy")]

    public async Task<IActionResult> GetAllCourses([FromQuery] CourseListQuery request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred. Please try again later." });
        }
    }


    [HttpPatch("update")]

    public async Task<IActionResult> UpdateCourse([FromBody] UpdateCourse request)
    {
        var response = await _mediator.Send(request);

        return response.Status switch
        {
            "Success" => Ok(response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var request = new DeleteCourse { Id = id };
        var response = await _mediator.Send(request);

        return response.Status switch
        {
            "Success" => Ok(response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }




}
