using System;
using System.Runtime.CompilerServices;

namespace Image2Ascii
{
    class Program
    {
        static void Main(string[] args)
        {
            // TODO: Lägg till startlogik här
            Console.WriteLine("Projektet startar...");
            var filepath = args[0];
            Console.WriteLine($"Bildfil: {filepath}");
            var asciiWidth = args.Length > 1 
                ? int.Parse(args[1]) 
                : 100;

            RunApp(filepath, asciiWidth);

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