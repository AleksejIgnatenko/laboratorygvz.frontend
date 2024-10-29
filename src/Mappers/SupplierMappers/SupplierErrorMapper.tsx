export const SupplierErrorMapper = (errors: Record<string, string>): Record<string, string> => {
  const mappedErrors: Record<string, string> = {};

  if (errors.SupplierName) {
    mappedErrors.supplierName = errors.SupplierName;
  }
  if (errors.Manufacturer) {
    mappedErrors.manufacturer = errors.Manufacturer;
  }

  return mappedErrors;
};
