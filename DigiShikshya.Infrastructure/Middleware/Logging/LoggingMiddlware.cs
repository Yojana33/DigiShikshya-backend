using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log the request
        _logger.LogInformation("Handling request: {Method} {Path}", context.Request.Method, context.Request.Path);

        // Copy the original response body stream
        var originalBodyStream = context.Response.Body;

        using (var responseBody = new MemoryStream())
        {
            context.Response.Body = responseBody;

            try
            {
                await _next(context);

                // Log the response
                context.Response.Body.Seek(0, SeekOrigin.Begin);
                var responseText = await new StreamReader(context.Response.Body).ReadToEndAsync();
                context.Response.Body.Seek(0, SeekOrigin.Begin);

                _logger.LogInformation("Response: {StatusCode} {ResponseText}", context.Response.StatusCode, responseText);

                await responseBody.CopyToAsync(originalBodyStream);
            }
            catch (Exception ex)
            {
                // Log the exception only if the response has not started
                if (!context.Response.HasStarted)
                {
                    // Log the exception
                    _logger.LogError(ex, "An error occurred while processing the request");

                    // Clear any existing response
                    context.Response.Clear();
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    context.Response.ContentType = "application/json";

                    // Set custom error response
                    var errorResponse = new { message = "An unexpected error occurred. Please try again later." };
                    var errorResponseJson = JsonSerializer.Serialize(errorResponse);

                    // Write the error response to the response body
                    await context.Response.WriteAsync(errorResponseJson);
                }
                else
                {
                    // If the response has started, rethrow the exception to let it propagate
                    throw;
                }
            }
        }
    }
}
