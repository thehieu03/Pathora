using Application.Contracts.Role;
using Domain.Enums;
using FluentValidation.TestHelper;

namespace Domain.Specs.Role;

public sealed class UpdateRoleRequestValidatorTests
{
    [Fact]
    public void Validate_WhenStatusIsOutsideRoleStatusEnum_ShouldHaveValidationError()
    {
        var validator = new UpdateRoleRequestValidator();
        var request = new UpdateRoleRequest(
            RoleId: 1,
            Name: "Admin",
            Description: "Test invalid status",
            Status: (RoleStatus)200,
            Type: 1,
            FunctionIds: []);

        var result = validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Status);
    }
}
