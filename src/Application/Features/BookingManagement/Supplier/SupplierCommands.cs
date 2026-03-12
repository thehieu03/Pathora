using Application.Contracts.Booking;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using FluentValidation;

namespace Application.Features.BookingManagement.Supplier;

public sealed record CreateSupplierCommand(
    string SupplierCode,
    SupplierType SupplierType,
    string Name,
    string? TaxCode,
    string? Phone,
    string? Email,
    string? Address,
    string? Note) : ICommand<ErrorOr<Guid>>;

public sealed class CreateSupplierCommandValidator : AbstractValidator<CreateSupplierCommand>
{
    public CreateSupplierCommandValidator()
    {
        RuleFor(x => x.SupplierCode)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);
    }
}

public sealed class CreateSupplierCommandHandler(ISupplierRepository supplierRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<CreateSupplierCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        var existing = await supplierRepository.GetByCodeAsync(request.SupplierCode);
        if (existing is not null)
        {
            return Error.Conflict("Supplier.CodeExists", "Mã nhà cung cấp đã tồn tại.");
        }

        var entity = SupplierEntity.Create(
            request.SupplierCode,
            request.SupplierType,
            request.Name,
            performedBy: "system",
            request.TaxCode,
            request.Phone,
            request.Email,
            request.Address,
            request.Note);

        await supplierRepository.AddAsync(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return entity.Id;
    }
}

public sealed record UpdateSupplierCommand(
    Guid SupplierId,
    string SupplierCode,
    SupplierType SupplierType,
    string Name,
    string? TaxCode,
    string? Phone,
    string? Email,
    string? Address,
    string? Note,
    bool IsActive) : ICommand<ErrorOr<Success>>;

public sealed class UpdateSupplierCommandValidator : AbstractValidator<UpdateSupplierCommand>
{
    public UpdateSupplierCommandValidator()
    {
        RuleFor(x => x.SupplierId)
            .NotEmpty();

        RuleFor(x => x.SupplierCode)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);
    }
}

public sealed class UpdateSupplierCommandHandler(ISupplierRepository supplierRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateSupplierCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var entity = await supplierRepository.GetByIdAsync(request.SupplierId);
        if (entity is null)
        {
            return Error.NotFound("Supplier.NotFound", "Không tìm thấy nhà cung cấp.");
        }

        var existing = await supplierRepository.GetByCodeAsync(request.SupplierCode);
        if (existing is not null && existing.Id != request.SupplierId)
        {
            return Error.Conflict("Supplier.CodeExists", "Mã nhà cung cấp đã tồn tại.");
        }

        entity.Update(
            request.SupplierCode,
            request.SupplierType,
            request.Name,
            performedBy: "system",
            request.TaxCode,
            request.Phone,
            request.Email,
            request.Address,
            request.Note,
            request.IsActive);

        supplierRepository.Update(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record DeleteSupplierCommand(Guid SupplierId) : ICommand<ErrorOr<Success>>;

public sealed class DeleteSupplierCommandHandler(ISupplierRepository supplierRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<DeleteSupplierCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteSupplierCommand request, CancellationToken cancellationToken)
    {
        var entity = await supplierRepository.GetByIdAsync(request.SupplierId);
        if (entity is null)
        {
            return Error.NotFound("Supplier.NotFound", "Không tìm thấy nhà cung cấp.");
        }

        entity.SoftDelete("system");
        supplierRepository.Update(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}
