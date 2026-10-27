namespace Domain.Entities;

public class ServicesPageItem : BaseEntity
{
    // Внутреннее название сервиса в CMS
    public string Name { get; set; } = string.Empty;

    // Например: 01, 02, 03...
    public string Number { get; set; } = string.Empty;

    // Например:
    // 01 / SEA FREIGHT
    public string Label { get; set; } = string.Empty;

    // Основной заголовок
    public string Title { get; set; } = string.Empty;

    // Выделенная часть заголовка
    public string HighlightedTitle { get; set; } = string.Empty;

    // Описание сервиса
    public string Description { get; set; } = string.Empty;

    // Текст badge поверх изображения
    public string ImageBadge { get; set; } = string.Empty;

    // Основное изображение сервиса
    public string? ImageUrl { get; set; }

    // Alt для изображения
    public string? ImageAlt { get; set; }

    // Benefits сервиса.
    // [
    //   {
    //     "number": "01",
    //     "title": "...",
    //     "description": "..."
    //   }
    // ]
    public string BenefitsJson { get; set; } = "[]";

    // Кнопка
    public string ButtonText { get; set; } = string.Empty;

    public string ButtonUrl { get; set; } = string.Empty;

    // Порядок отображения
    public int SortOrder { get; set; }

    // Можно скрыть сервис без удаления
    public bool IsVisible { get; set; } = true;

    // Связь с Services Page
    public int ServicesPageContentId { get; set; }

    public ServicesPageContent ServicesPageContent { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}