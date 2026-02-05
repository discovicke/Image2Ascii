using System.Globalization;

namespace Image2AsciiApi.Models;

public class ConvertImageDTO
{
    public IFormFile Image { get; set; } = null!;
    public string Width { get; set; } = "100";
    public string Brightness { get; set; } = "0.0";
    public string Gamma { get; set; } = "1.0";
    public string Invert { get; set; } = "false";

    public int GetWidth() => int.TryParse(Width, out var w) ? w : 100;
    
    public double GetBrightness() => double.TryParse(Brightness, NumberStyles.Any, CultureInfo.InvariantCulture, out var b) ? b : 0.0;
    
    public double GetGamma() => double.TryParse(Gamma, NumberStyles.Any, CultureInfo.InvariantCulture, out var g) ? g : 1.0;
    
    public bool GetInvert() => bool.TryParse(Invert, out var i) && i;
}