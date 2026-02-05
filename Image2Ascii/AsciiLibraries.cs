public enum AsciiLibrary
{
    Classic,
    Detailed,
    Blocks,
    Minimal,
    Monochrome
}

public static class AsciiLibraries
{
    public static string Get(AsciiLibrary lib) => lib switch
    {
        AsciiLibrary.Classic => "@%#*+=-:. ",
        AsciiLibrary.Detailed => "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
        AsciiLibrary.Blocks => "█▓▒░@#*+=-:. ",
        AsciiLibrary.Minimal => "#*. ",
        AsciiLibrary.Monochrome => " .",
        _ => throw new ArgumentOutOfRangeException(nameof(lib), lib, null)
    };
}
