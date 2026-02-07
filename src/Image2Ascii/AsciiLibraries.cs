public static class AsciiLibraries
{
    private static readonly Dictionary<string, string> Libraries = new()
    {
        // Original
        ["Classic"] = "@%#*+=-:. ",
        ["Detailed"] = "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
        ["Blocks"] = "█▓▒░@#*+=-:. ",
        ["Minimal"] = "#*. ",

        // High contrast
        ["HighContrast1"] = "#@%=:*-. ",
        ["HighContrast3"] = "▓▒░ .",

        // Soft / smooth
        ["Soft1"] = "MNHQ$OC?7>!:-;. ",
        ["Soft2Short"] = "@%#*+=-:.  ",

        // Blocky / graphical
        ["Emojiish"] = "⬛⬜⚪ ",
    
        // Print / symbols
        ["PrintFriendly"] = "@#SXxo;:,. ",
        ["Numbers"] = "9876543210",

        // Retro / digital
        ["Matrix"] = "0O1l|",
        ["Cyberpunk"] = "█▓▒░><{}[]",
        ["LCD"] = "-_~*o+",

        // Minimalist variations
        ["Minimal3"] = "@o.",
        ["Thin"] = "#:.",
        ["SoftDots"] = "·°•",

        // Dithering-friendly
        ["Dither1"] = " .,:;i1tfLCG08@",
        ["Dither2"] = " .'`^\",:;Il!i><~+_-?][}{1)(|\\tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",

        // Experimental / artistic
        ["StarsAndSky"] = "*oO ",
        ["Wave"] = "≈~*- ",
    };


    public static string Get(string libraryName)
    {
        return Libraries.TryGetValue(libraryName, out var charset)
            ? charset
            : Libraries["Classic"];
    }

    public static IEnumerable<string> GetNames() => Libraries.Keys;
}