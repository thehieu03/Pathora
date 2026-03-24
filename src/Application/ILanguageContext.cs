namespace Application;

public interface ILanguageContext
{
    string CurrentLanguage { get; set; }
    string DefaultLanguage { get; }
}
