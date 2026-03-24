namespace Application;

public sealed class LanguageContext : ILanguageContext
{
    private string _currentLanguage = "vi";

    public string CurrentLanguage
    {
        get => _currentLanguage;
        set => _currentLanguage = string.IsNullOrWhiteSpace(value) ? "vi" : value;
    }

    public string DefaultLanguage => "vi";
}
