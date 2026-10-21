namespace Domain.Entities;

public class HomePageSection : BaseEntity
{
    // Hero, Services, GlobalNetwork, Tracking,
    // Destinations, WhySeaTrack, CallToAction
    public string SectionType { get; set; } = string.Empty;

    // Название секции внутри CMS
    public string Name { get; set; } = string.Empty;

    // Порядок отображения на Home Page
    public int SortOrder { get; set; }

    // Можно скрыть секцию, не удаляя её
    public bool IsVisible { get; set; } = true;

    // Содержимое секции.
    // Для каждого SectionType здесь будет своя JSON-структура.
    public string ContentJson { get; set; } = "{}";

    // Основное изображение секции.
    // Сюда будет сохраняться путь после загрузки файла с компьютера.
    public string? ImageUrl { get; set; }

    // Связь с Home Page
    public int HomePageContentId { get; set; }

    public HomePageContent HomePageContent { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}