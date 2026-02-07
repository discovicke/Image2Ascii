using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Image2Ascii;

public class ImageToAscii
{
    // Ny metod som tar AsciiOptions
    public static string ConvertToAscii(string imagePath, AsciiOptions options)
    {
        Console.WriteLine(
            $"🟩 [CONVERTER] Starting conversion with: Width={options.Width}, Brightness={options.Brightness}, Gamma={options.Gamma}, Invert={options.Invert}");

        using var image = Image.Load<Rgb24>(imagePath);

        int height = (int)(image.Height * options.Width / (double)image.Width * 0.5);

        image.Mutate(x => x.Resize(options.Width, height));

        var result = new System.Text.StringBuilder();

        for (int y = 0; y < image.Height; y++)
        {
            for (int x = 0; x < image.Width; x++)
            {
                var pixel = image[x, y];
                double luminance = (0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B) / 255.0;

               
                luminance = Math.Clamp(luminance + options.Brightness, 0.0, 1.0);
                
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

        Console.WriteLine($"🟩 [CONVERTER] Conversion complete");
        return result.ToString();
    }
}