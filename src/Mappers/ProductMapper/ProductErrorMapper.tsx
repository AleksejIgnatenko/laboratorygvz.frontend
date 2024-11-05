export const ProductErrorMapper = (errors: Record<string, string>): Record<string, string> => {
    const mappedErrors: Record<string, string> = {};
  
    if (errors.ProductName) {
      mappedErrors.productName = errors.ProductName;
    }
  
    return mappedErrors;
  };
  