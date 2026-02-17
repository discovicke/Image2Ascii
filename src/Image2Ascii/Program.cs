using System;
using System.Runtime.CompilerServices;

namespace Image2Ascii
{
    class Program
    {
        static void Main(string[] args)
        {
            // TODO: Lägg till startlogik här
            if (args.Length == 0)
            {
                Console.WriteLine("Användning: Image2Ascii.exe <bildväg> [width] [brightness] [gamma] [invert]");
                Console.WriteLine("Exempel: Image2Ascii.exe bild.jpg 100 0.2 1.2 false");
                return;
            }
            Console.WriteLine("Projektet startar...");
            var filepath = args[0];
            Console.WriteLine($"Bildfil: {filepath}");
            var options = new AsciiOptions
            {
                Width = args.Length > 1 ? int.Parse(args[1]) : 100,
                Brightness = args.Length > 2 ? double.Parse(args[2]) : 0.0,
                Gamma = args.Length > 3 ? double.Parse(args[3]) : 1.0,
                Invert = args.Length > 5 && bool.Parse(args[5])
            };
            
            Console.WriteLine($"Bildfil: {filepath}");
            Console.WriteLine($"Width: {options.Width}");
            Console.WriteLine($"Brightness: {options.Brightness}");
            Console.WriteLine($"Gamma: {options.Gamma}");
            Console.WriteLine($"Invert: {options.Invert}");


            RunApp(filepath, options);

            // Vänta på användaren innan programmet avslutas
            Console.WriteLine("Tryck på valfri tangent för att avsluta...");
            Console.ReadKey();
        }

        // Exempelmetod
        static void RunApp(string filepath, AsciiOptions options)
        {
            Console.WriteLine("Genererar ASCII-art...");

            List<string> asciiFrames;
            try
            {
                // Vi använder en stream även här för att testa den nya metoden
                using (var stream = File.OpenRead(filepath))
                {
                    asciiFrames = ImageToAscii.ConvertToAscii(stream, options);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Kunde inte läsa via stream: {ex.Message}. Fallback till filepath.");
                asciiFrames = ImageToAscii.ConvertToAscii(filepath, options);
            }

            foreach (var frame in asciiFrames)
            {
                Console.WriteLine(frame);
            }

            // Spara till fil (endast första framen för enkelhetens skull i CLI)
            var filenameWithoutExtension = Path.GetFileNameWithoutExtension(filepath);
            var filename = $"{filenameWithoutExtension}_ascii.txt";
            File.WriteAllText(filename, asciiFrames[0]);
            
            Console.WriteLine($"Sparat (första framen) till: {filename}");
        }
    }
}