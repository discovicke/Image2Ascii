using System.Text;

public class AsciiOptions
{
    public int Width { get; set; } = 100;

    // -1.0 .. +1.0 (Frontend = Slider?)
    public double Brightness { get; set; } = 0.0;

    // Gamma 0.5 – 2.0 (Frontend = Slider?)
    public double Gamma { get; set; } = 1.0;

    public bool Invert { get; set; } = false;

    public AsciiLibrary SelectedLibrary { get; set; } = AsciiLibrary.Classic;
    
    public string AsciiChars => AsciiLibraries.Get(SelectedLibrary);

}