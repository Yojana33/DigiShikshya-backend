using MediatR;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v1/course")]
public class CourseController(IMediator _mediator) : ControllerBase
{
    [HttpPost("add")]
    public async Task<IActionResult> AddCourse(AddNewCourse request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

}