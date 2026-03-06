namespace Application.Common.Interfaces;

public interface ILanguageContext
{
    const string DefaultLanguage = "vi";

    string CurrentLanguage { get; set; }
}
