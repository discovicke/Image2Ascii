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
        Console.WriteLine("🟨 [CONTROLLER] === REQUEST RECEIVED ===");
        Console.WriteLine($"🟨 [CONTROLLER] Content-Type: {Request.ContentType}");
        Console.WriteLine($"🟨 [CONTROLLER] Form keys: {string.Join(", ", Request.Form.Keys)}");
    
        foreach (var key in Request.Form.Keys)
        {
            Console.WriteLine($"🟨 [CONTROLLER] Form[{key}] = '{Request.Form[key]}' (type: {Request.Form[key].GetType()})");
        }
    
        Console.WriteLine($"🟨 [CONTROLLER] Files count: {Request.Form.Files.Count}");
        if (Request.Form.Files.Count > 0)
        {
            Console.WriteLine($"🟨 [CONTROLLER] First file: {Request.Form.Files[0].FileName}, Length: {Request.Form.Files[0].Length}");
        }

        Console.WriteLine("🟨 [CONTROLLER] Bound parameters:");
        Console.WriteLine($"🟨 [CONTROLLER] image is null: {image == null}");
        Console.WriteLine($"🟨 [CONTROLLER] width={width}, brightness={brightness}, gamma={gamma}, invert={invert}");
    
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

            Console.WriteLine($"🟨 [CONTROLLER] AsciiOptions created: Width={options.Width}, Brightness={options.Brightness}, Gamma={options.Gamma}, Invert={options.Invert}");

            var asciiArt = ImageToAscii.ConvertToAscii(tempPath, options);
        
            Console.WriteLine($"🟨 [CONTROLLER] ASCII generated, length: {asciiArt.Length}");
        
            System.IO.File.Delete(tempPath);

            return Ok(new { ascii = asciiArt });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔴 [CONTROLLER] ERROR: {ex.Message}");
            Console.WriteLine($"🔴 [CONTROLLER] Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { error = ex.Message });
        }
    }

}
