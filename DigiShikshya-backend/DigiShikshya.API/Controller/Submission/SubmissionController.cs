using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/submission")]
public class SubmissionController(IMediator _mediator, SubmissionService _submissionService) : ControllerBase
{
    private readonly IMediator _mediator = _mediator;

    [HttpPost("add")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddSubmission([FromForm] AddNewSubmission request)
    {
        var response = await _mediator.Send(request);
        return response.Status switch
        {
            "Success" => CreatedAtAction(nameof(AddSubmission), response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllSubmissions([FromQuery] SubmissionListQuery request)
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
    [HttpPost("check-plagiarism")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CheckPlagiarism([FromForm] CheckPlagiarismCommand request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
        }

    }

}