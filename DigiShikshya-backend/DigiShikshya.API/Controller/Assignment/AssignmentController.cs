using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/assignment")]
public class AssignmentController(IMediator _mediator) : ControllerBase
{
    [HttpPost("add")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddAssignment(AddNewAssignment request)
    {
        var response = await _mediator.Send(request);
        return response.Status switch
        {
            "Success" => CreatedAtAction(nameof(AddAssignment), response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllAssignments([FromQuery] AssignmentListQuery request)
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateAssignment(UpdateAssignment request)
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteAssignment(Guid id)
    {
        var request = new DeleteAssignment { Id = id };
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
