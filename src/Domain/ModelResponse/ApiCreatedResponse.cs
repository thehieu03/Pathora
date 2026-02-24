namespace Domain.ApiModel;

public sealed class ApiCreatedResponse<T>
{
    public T Value { get; set; } = default!;
    public ApiCreatedResponse() { }
    public ApiCreatedResponse(T value)
    {
        Value = value;
    }
}