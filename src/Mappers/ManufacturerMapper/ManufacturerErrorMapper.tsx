export const ManufacturerErrorMapper = (errors: Record<string, string>): Record<string, string> => {
    const mappedErrors: Record<string, string> = {};
  
    if (errors.ManufacturerName) {
      mappedErrors.manufacturerName = errors.ManufacturerName;
    }
  
    return mappedErrors;
  };
  