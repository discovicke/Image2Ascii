using Microsoft.AspNetCore.Mvc;
using Image2Ascii;

namespace Image2AsciiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AsciiController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> ConvertImage(
        [FromForm] IFormFile image,
        [FromForm] int width = 100,
        [FromForm] double brightness = 0.0,
        [FromForm] double gamma = 1.0,
        [FromForm] bool invert = false)
    {
        if (image == null || image.Length == 0)
            return BadRequest(new { error = "No image uploaded" });

        try
        {
            var tempPath = Path.GetTempFileName();
            
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var options = new AsciiOptions
            {
                Width = width,
                Brightness = brightness,
                Gamma = gamma,
                Invert = invert
            };

            var asciiArt = ImageToAscii.ConvertToAscii(tempPath, options);
            System.IO.File.Delete(tempPath);

            return Ok(new { ascii = asciiArt });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
