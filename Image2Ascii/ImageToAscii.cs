using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Image2Ascii;

public class ImageToAscii
{
    private const string AsciiChars = "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";


    public static string ConvertToAscii(string imagePath, int width)
    {
        using var image = Image.Load<Rgb24>(imagePath);

        // Beräkna ny höjd baserat på aspect ratio
        int height = (int)(image.Height * width / (double)image.Width * 0.5);

        // Skala om bilden
        image.Mutate(x => x.Resize(width, height));

        var result = new System.Text.StringBuilder();

        for (int y = 0; y < image.Height; y++)
        {
            for (int x = 0; x < image.Width; x++)
            {
                var pixel = image[x, y];

                // Beräkna luminans
                int brightness = (int)(0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B);

                // Mappa luminans till ASCII-tecken
                int index = brightness * (AsciiChars.Length - 1) / 255;
                result.Append(AsciiChars[index]);
            }

            result.AppendLine();
        }

        return result.ToString();
    }
}