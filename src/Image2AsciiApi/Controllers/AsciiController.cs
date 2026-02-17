using Microsoft.AspNetCore.Mvc;
using Image2Ascii;
using Image2AsciiApi.Models;
using SixLabors.ImageSharp;

namespace Image2AsciiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AsciiController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> ConvertImage([FromForm] ConvertImageDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (request.Image == null || request.Image.Length == 0)
            return BadRequest(new { error = "No image uploaded" });

        // 1. Validate file size (max 10MB)
        const long maxFileSize = 10 * 1024 * 1024;
        if (request.Image.Length > maxFileSize)
            return BadRequest(new { error = "File size exceeds the 10MB limit" });

        // 2. Validate file extension
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        var extension = Path.GetExtension(request.Image.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            return BadRequest(new { error = "Invalid file type. Only images (JPG, PNG, GIF, BMP, WEBP) are allowed." });

        try
        {
            // 3. Validate image content
            using (var validationStream = request.Image.OpenReadStream())
            {
                var format = await Image.IdentifyAsync(validationStream);
                if (format == null)
                {
                    return BadRequest(new { error = "The uploaded file is not a valid image or is corrupted." });
                }
            }

            var options = new AsciiOptions
            {
                Width = request.GetWidth(),
                Brightness = request.GetBrightness(),
                Gamma = request.GetGamma(),
                Invert = request.GetInvert(),
                SelectedLibrary = request.AsciiLibrary ?? "Classic"
            };

            // Primary method: Stream-based conversion (In-memory)
            try
            {
                using var processStream = request.Image.OpenReadStream();
                var asciiArt = ImageToAscii.ConvertToAscii(processStream, options);
                return Ok(new { ascii = asciiArt });
            }
            catch (Exception streamEx)
            {
                Console.WriteLine($"🟨 [CONTROLLER] Stream conversion failed, falling back to file: {streamEx.Message}");
                
                // Fallback method: File-based conversion
                string tempPath = Path.GetTempFileName();
                try
                {
                    using (var stream = new FileStream(tempPath, FileMode.Create))
                    {
                        await request.Image.CopyToAsync(stream);
                    }

                    var asciiArt = ImageToAscii.ConvertToAscii(tempPath, options);
                    return Ok(new { ascii = asciiArt });
                }
                finally
                {
                    if (System.IO.File.Exists(tempPath))
                        System.IO.File.Delete(tempPath);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔴 [CONTROLLER] ERROR: {ex.Message}");
            return StatusCode(500, new { error = "An unexpected error occurred during processing." });
        }
    }
}
