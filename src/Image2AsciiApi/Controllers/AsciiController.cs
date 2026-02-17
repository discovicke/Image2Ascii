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

        // 1. Validate file size (max 50MB)
        const long maxFileSize = 50 * 1024 * 1024;
        if (request.Image.Length > maxFileSize)
            return BadRequest(new { error = "File size exceeds the 50MB limit" });

        // 2. Validate file extension
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        var extension = Path.GetExtension(request.Image.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            return BadRequest(new { error = "Invalid file type. Only images (JPG, PNG, GIF, BMP, WEBP) are allowed." });

        try
        {
            // 3. Validate image content and check pixel budget
            using (var validationStream = request.Image.OpenReadStream())
            {
                var imageInfo = await Image.IdentifyAsync(validationStream);
                if (imageInfo == null)
                {
                    return BadRequest(new { error = "The uploaded file is not a valid image or is corrupted." });
                }

                // Pixel Budget: Max 40 million total pixels (Width * Height * Frames / Step)
                // This ensures we stay well within Render's 512MB RAM
                const int maxFrames = 60;
                int estimatedFrames = Math.Min(imageInfo.FrameCount, maxFrames);
                long totalPixels = (long)imageInfo.Width * imageInfo.Height * estimatedFrames;
                
                if (totalPixels > 40_000_000) 
                {
                    return BadRequest(new { 
                        error = $"Image is too large to process. Please reduce resolution or frame count. (Detected: {imageInfo.Width}x{imageInfo.Height}, {imageInfo.FrameCount} frames)" 
                    });
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
                var asciiFrames = ImageToAscii.ConvertToAscii(processStream, options);
                
                // Explicitly trigger GC to free up memory immediately
                var response = Ok(new { frames = asciiFrames });
                GC.Collect(2, GCCollectionMode.Forced, true);
                return response;
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

                    var asciiFrames = ImageToAscii.ConvertToAscii(tempPath, options);
                    
                    var response = Ok(new { frames = asciiFrames });
                    GC.Collect(2, GCCollectionMode.Forced, true);
                    return response;
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
