export const SupplierErrorMapper = (errors: Record<string, string>): Record<string, string> => {
  const mappedErrors: Record<string, string> = {};

  if (errors.SupplierName) {
    mappedErrors.supplierName = errors.SupplierName;
  }

  return mappedErrors;
};
