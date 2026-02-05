public class AsciiOptions
{
    public int Width { get; set; } = 100;
    public double Brightness { get; set; } = 0.0;
    public double Gamma { get; set; } = 1.0;
    public bool Invert { get; set; } = false;

    public string SelectedLibrary { get; set; } = "Classic";

    public string? CustomAscii { get; set; }

    public string AsciiChars => !string.IsNullOrEmpty(CustomAscii)
        ? CustomAscii
        : AsciiLibraries.Get(SelectedLibrary);
}