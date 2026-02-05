using Microsoft.AspNetCore.Mvc;
using Image2Ascii;
using Image2AsciiApi.Models;

namespace Image2AsciiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AsciiController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> ConvertImage([FromForm] ConvertImageDto request)
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
        Console.WriteLine($"🟨 [CONTROLLER] image is null: {request.Image == null}");
        Console.WriteLine($"🟨 [CONTROLLER] width='{request.Width}', brightness='{request.Brightness}', gamma='{request.Gamma}', invert='{request.Invert}'");

        if (request.Image == null || request.Image.Length == 0)
            return BadRequest(new { error = "No image uploaded" });

        try
        {
            var tempPath = Path.GetTempFileName();

            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await request.Image.CopyToAsync(stream);
            }

            var options = new AsciiOptions
            {
                Width = request.GetWidth(),
                Brightness = request.GetBrightness(),
                Gamma = request.GetGamma(),
                Invert = request.GetInvert(),
                SelectedLibrary = request.AsciiLibrary ?? "Classic"
            };

            Console.WriteLine($"🟨 [CONTROLLER] AsciiOptions created: Width={options.Width}, Brightness={options.Brightness}, Gamma={options.Gamma}, Invert={options.Invert}");
            var asciiArt = ImageToAscii.ConvertToAscii(tempPath, options);
            Console.WriteLine($"🟨 [CONTROLLER] ASCII generated, length: {asciiArt?.Length ?? 0}");

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
