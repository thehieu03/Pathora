using Application.Common.Interfaces;

namespace Infrastructure.Localization;

public sealed class LanguageContext : ILanguageContext
{
    public string CurrentLanguage { get; set; } = ILanguageContext.DefaultLanguage;
}
