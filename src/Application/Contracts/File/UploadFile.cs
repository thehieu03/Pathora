namespace Application.Contracts.File;

public sealed record UploadFileRequest(
    Stream Stream,
    string FileName
);
