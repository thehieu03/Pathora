using Domain.ApiModel;
using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
public abstract class BaseApiController : ControllerBase
{
    private ISender? _sender;
    protected ISender Sender => _sender ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    protected IActionResult HandleResult<T>(
        ErrorOr<T> result,
        int successStatusCode = StatusCodes.Status200OK,
        string successMessage = "Thành công")
    {
        if (result.IsError)
        {
            var firstError = result.FirstError;
            var statusCode = firstError.Type switch
            {
                ErrorType.NotFound => StatusCodes.Status404NotFound,
                ErrorType.Validation => StatusCodes.Status400BadRequest,
                ErrorType.Conflict => StatusCodes.Status409Conflict,
                ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
                ErrorType.Forbidden => StatusCodes.Status403Forbidden,
                _ => StatusCodes.Status500InternalServerError
            };

            return StatusCode(statusCode, ResultSharedResponse<object>.Failure(
                statusCode: statusCode,
                instance: HttpContext.Request.Path,
                errors: result.Errors.Select(e => new ErrorResult(e.Description, e.Code)).ToList(),
                message: firstError.Description));
        }

        return StatusCode(successStatusCode, ResultSharedResponse<T>.Success(
            result.Value,
            successMessage,
            HttpContext.Request.Path,
            successStatusCode));
    }

    protected IActionResult HandleCreated<T>(
        ErrorOr<T> result,
        string successMessage = "Tạo thành công",
        int successStatusCode = StatusCodes.Status201Created)
    {
        if (result.IsError)
        {
            return HandleResult(result);
        }

        return StatusCode(successStatusCode, ResultSharedResponse<ApiCreatedResponse<T>>.Success(
            new ApiCreatedResponse<T>(result.Value),
            successMessage,
            HttpContext.Request.Path,
            successStatusCode));
    }

    protected IActionResult HandleUpdated<T>(
        ErrorOr<T> result,
        string successMessage = "Cập nhật thành công",
        int successStatusCode = StatusCodes.Status200OK)
    {
        if (result.IsError)
        {
            return HandleResult(result);
        }

        return StatusCode(successStatusCode, ResultSharedResponse<ApiUpdatedResponse<T>>.Success(
            new ApiUpdatedResponse<T>(result.Value),
            successMessage,
            HttpContext.Request.Path,
            successStatusCode));
    }

    protected IActionResult HandleDeleted<T>(
        ErrorOr<T> result,
        string successMessage = "Xóa thành công",
        int successStatusCode = StatusCodes.Status200OK)
    {
        if (result.IsError)
        {
            return HandleResult(result);
        }

        return StatusCode(successStatusCode, ResultSharedResponse<ApiDeletedResponse<T>>.Success(
            new ApiDeletedResponse<T>(result.Value),
            successMessage,
            HttpContext.Request.Path,
            successStatusCode));
    }

    protected IActionResult HandleGet<T>(
        ErrorOr<T> result,
        string successMessage = "Lấy dữ liệu thành công",
        int successStatusCode = StatusCodes.Status200OK)
    {
        if (result.IsError)
        {
            return HandleResult(result);
        }

        return StatusCode(successStatusCode, ResultSharedResponse<ApiGetResponse<T>>.Success(
            new ApiGetResponse<T>(result.Value),
            successMessage,
            HttpContext.Request.Path,
            successStatusCode));
    }

    protected IActionResult HandlePerformed<T>(
        ErrorOr<T> result,
        string successMessage = "Thực thi thành công",
        int successStatusCode = StatusCodes.Status200OK)
    {
        if (result.IsError)
        {
            return HandleResult(result);
        }

        return StatusCode(successStatusCode, ResultSharedResponse<ApiPerformedResponse<T>>.Success(
            new ApiPerformedResponse<T>(result.Value),
            successMessage,
            HttpContext.Request.Path,
            successStatusCode));
    }
}
