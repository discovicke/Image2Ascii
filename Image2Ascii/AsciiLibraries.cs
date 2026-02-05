public static class AsciiLibraries
{
    private static readonly Dictionary<string, string> Libraries = new()
    {
        ["Classic"] = "@%#*+=-:. ",
        ["Detailed"] = "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
        ["Blocks"] = "█▓▒░@#*+=-:. ",
        ["Minimal"] = "#*. ",
        ["Monochrome"] = " ."
    };

    public static string Get(string libraryName)
    {
        return Libraries.TryGetValue(libraryName, out var charset)
            ? charset
            : Libraries["Classic"];
    }

    public static IEnumerable<string> GetNames() => Libraries.Keys;
}