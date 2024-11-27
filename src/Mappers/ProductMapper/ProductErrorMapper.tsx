export const ProductErrorMapper = (
  errors: Record<string, string>
): Record<string, string> => {
  const mappedErrors: Record<string, string> = {};

  if (errors.ProductName) {
    mappedErrors.productName = errors.ProductName;
  }

  if (errors.UnitsOfMeasurement) {
    mappedErrors.unitsOfMeasurement = errors.UnitsOfMeasurement;
  }

  return mappedErrors;
};
