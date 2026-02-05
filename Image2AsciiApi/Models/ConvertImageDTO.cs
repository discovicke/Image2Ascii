using System.Globalization;

namespace Image2AsciiApi.Models;

public class ConvertImageDto
{
    public IFormFile? Image { get; set; }
    public string Width { get; set; } = "100";
    public string Brightness { get; set; } = "0.0";
    public string Gamma { get; set; } = "1.0";
    public string Invert { get; set; } = "false";

    public int GetWidth()
    {
        if (int.TryParse(Width, NumberStyles.Integer, CultureInfo.InvariantCulture, out var w))
            return w;
        if (int.TryParse(Width, out w))
            return w;
        return 100;
    }

    public double GetBrightness()
    {
        var s = (Brightness ?? "0").Replace(',', '.');
        if (double.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out var d))
            return d;
        return 0.0;
    }

    public double GetGamma()
    {
        var s = (Gamma ?? "1").Replace(',', '.');
        if (double.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out var d))
            return d;
        return 1.0;
    }

    public bool GetInvert()
    {
        var s = (Invert ?? "false").Trim();
        if (bool.TryParse(s, out var b))
            return b;
        if (s == "1") return true;
        if (s == "0") return false;
        return false;
    }
}