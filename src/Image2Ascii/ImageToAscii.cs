using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Image2Ascii;

public class ImageToAscii

{

    public static List<string> ConvertToAscii(string imagePath, AsciiOptions options)

    {

        using var stream = File.OpenRead(imagePath);

        return ConvertToAscii(stream, options);

    }



    public static List<string> ConvertToAscii(Stream imageStream, AsciiOptions options)

    {

        Console.WriteLine(

            $"🟩 [CONVERTER] Starting conversion with: Width={options.Width}, Brightness={options.Brightness}, Gamma={options.Gamma}, Invert={options.Invert}");



        using var image = Image.Load<Rgb24>(imageStream);

        var frames = new List<string>();



                for (int i = 0; i < image.Frames.Count; i++)



                {



                    using var frameImage = image.Frames.CloneFrame(i);



                    int height = (int)(frameImage.Height * options.Width / (double)frameImage.Width * 0.5);



                    frameImage.Mutate(x => x.Resize(options.Width, height));



        



                    var result = new System.Text.StringBuilder();



        



                    for (int y = 0; y < frameImage.Height; y++)



                    {



                        for (int x = 0; x < frameImage.Width; x++)



                        {



                            var pixel = frameImage[x, y];



        

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

            frames.Add(result.ToString());

        }



        Console.WriteLine($"🟩 [CONVERTER] Conversion complete, frames generated: {frames.Count}");

        return frames;

    }

}
