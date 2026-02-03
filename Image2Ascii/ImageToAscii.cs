using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Image2Ascii;

public class ImageToAscii
{
    public static string ConvertToAscii(string imagePath, int width)
    {
        using var image = Image.Load<Rgb24>(imagePath);
        var options = new AsciiOptions();

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

                double luminance = (0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B) / 255.0;

                // Brightness shift
                luminance = Math.Clamp(luminance + options.Brightness, 0.0, 1.0);

                // Gamma correction
                luminance = Math.Pow(luminance, options.Gamma);

                if (options.Invert)
                {
                    luminance = 1.0 - luminance;
                }

                int index = (int)(luminance * (options.AsciiChars.Length - 1));
                result.Append(options.AsciiChars[index]);
            }

            result.AppendLine();
        }

        return result.ToString();
    }
}