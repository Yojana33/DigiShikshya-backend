using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using DigiShikshya.Infrastructure.Services;

[ApiController]
[Route("api/v1/material")]
public class MaterialController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly VideoService _videoService;

    public MaterialController(IMediator mediator, VideoService videoService)
    {
        _mediator = mediator;
        _videoService = videoService;
    }

    [HttpPost("add")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddMaterial([FromForm] AddNewMaterial request)
    {
        var response = await _mediator.Send(request);

        return response.Status switch
        {
            "Success" => CreatedAtAction(nameof(AddMaterial), response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

    [HttpDelete("delete/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteMaterial(Guid id)
    {
        var response = await _mediator.Send(new DeleteMaterial { Id = id });

        return response.Status switch
        {
            "Success" => Ok(response),
            "Bad Request" => BadRequest(response),
            "Internal Server Error" => StatusCode(StatusCodes.Status500InternalServerError, response),
            _ => StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllMaterials([FromQuery] MaterialListQuery request)
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

    [HttpPut("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateMaterial([FromForm] UpdateMaterial request)
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

    // [HttpGet("streamVideo/{id}")]
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status404NotFound)]
    // [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    // public async Task<IActionResult> StreamVideo(Guid id)
    // {
    //     // Use the VideoService to get the video stream
    //     var videoStream = await _videoService.GetVideoStream(id);

    //     if (videoStream == null)
    //     {
    //         return NotFound(new { message = "Video not found." });
    //     }

    //     return File(videoStream, "video/mp4"); // Assuming MP4, adjust MIME type if different
    // }


}