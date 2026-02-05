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
                Invert = args.Length > 4 && bool.Parse(args[4])
            };

            RunApp(filepath, options.Width);

            // Vänta på användaren innan programmet avslutas
            Console.WriteLine("Tryck på valfri tangent för att avsluta...");
            Console.ReadKey();
        }

        // Exempelmetod
        static void RunApp(string filepath, int asciiWidth)
        {
            Console.WriteLine("Appen körs...");
            
            var ascii = ImageToAscii.ConvertToAscii(filepath, asciiWidth);
            Console.WriteLine(ascii);

            // Spara till fil
            var filename = filepath.Split('.')[0] + "_ascii.txt";
            File.WriteAllText(filename, ascii);
        }
    }
}