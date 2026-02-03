using Microsoft.AspNetCore.Mvc;
using Image2Ascii; // eller det namespace där din ImageToAscii-klass ligger

namespace Image2AsciiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AsciiController : ControllerBase
{
    [HttpPost("convert")]
    public async Task<IActionResult> ConvertImage([FromForm] IFormFile image, [FromForm] int width = 100)
    {
        if (image == null || image.Length == 0)
            return BadRequest("No image uploaded");

        var tempPath = Path.GetTempFileName();
        
        using (var stream = new FileStream(tempPath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        var asciiArt = ImageToAscii.ConvertToAscii(tempPath, width);
        System.IO.File.Delete(tempPath);

        return Ok(new { ascii = asciiArt });
    }
}