using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/semester")]
public class SemesterController(IMediator _mediator) : ControllerBase
{
    [HttpPost("add")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddSemester(AddNewSemester request)
    {
        var response = await _mediator.Send(request);

        return response.Status switch
        {
            "Success" => CreatedAtAction(nameof(AddSemester), response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllSemesters([FromQuery] SemesterListQuery request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (Exception)
        {
            // Log the exception (optional, if not already logged by middleware)
            // _logger.LogError(ex, "An error occurred while processing the request");

            // Return a custom error response
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred. Please try again later." });
        }
    }

    [HttpPatch("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateSemester(UpdateSemester request)
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
    public async Task<IActionResult> DeleteSemester(Guid id)
    {
        var request = new DeleteSemester { Id = id };
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
