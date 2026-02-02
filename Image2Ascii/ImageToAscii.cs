using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Image2Ascii;

public class ImageToAscii
{
    private const string AsciiChars = "@%#*+=-:. ";

    public static string ConvertToAscii(string imagePath, int width)
    {
        using var image = Image.Load<Rgb24>(imagePath);

        // Beräkna ny höjd baserat på aspect ratio
        int height = (int)(image.Height * width / (double)image.Width * 0.5);

        // Skala om bilden
        image.Mutate(x => x.Resize(width, height));

        var result = new System.Text.StringBuilder();



        return result.ToString();
    }
}