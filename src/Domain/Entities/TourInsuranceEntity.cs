using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities;

public class TourInsuranceEntity
{
    public Guid TourInsuranceId { get; set; }
    public string InsuranceName { get; set; } = null!;
    public InsuranceType InsuranceType { get; set; }
    public string InsuranceProvider { get; set; } = null!;
    public string CoverageDesciption { get; set; } = null!;
    public decimal CoverageAmount { get; set; }
    public decimal CoverageFee { get; set; }
    public bool IsOptional { get; set; } = false;
    public string? Note { get; set; }
    public TourClassificationEntity TourClassification { get; set; } = null!;

    public static TourInsuranceEntity Create(string insuranceName, InsuranceType insuranceType, string insuranceProvider, string coverageDescription, decimal coverageAmount, decimal coverageFee, bool isOptional = false, string? note = null)
    {
        return new TourInsuranceEntity
        {
            TourInsuranceId = Guid.CreateVersion7(),
            InsuranceName = insuranceName,
            InsuranceType = insuranceType,
            InsuranceProvider = insuranceProvider,
            CoverageDesciption = coverageDescription,
            CoverageAmount = coverageAmount,
            CoverageFee = coverageFee,
            IsOptional = isOptional,
            Note = note
        };
    }

    public void Update(string insuranceName, InsuranceType insuranceType, string insuranceProvider, string coverageDescription, decimal coverageAmount, decimal coverageFee, bool isOptional, string? note = null)
    {
        InsuranceName = insuranceName;
        InsuranceType = insuranceType;
        InsuranceProvider = insuranceProvider;
        CoverageDesciption = coverageDescription;
        CoverageAmount = coverageAmount;
        CoverageFee = coverageFee;
        IsOptional = isOptional;
        Note = note;
    }
}
