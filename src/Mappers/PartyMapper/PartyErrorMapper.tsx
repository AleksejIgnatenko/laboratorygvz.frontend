export const PartyErrorMapper = (errors: Record<string, string>): Record<string, string> => {
    const mappedErrors: Record<string, string> = {};
  
    // Define the fields to map
    const fields = [
      'BatchNumber',
      'DateOfReceipt',
      'ProductName',
      'SupplierName',
      'ManufacturerName',
      'BatchSize',
      'SampleSize',
      'Ttn',
      'DocumentOnQualityAndSafety',
      'TestReport',
      'DateOfManufacture',
      'ExpirationDate',
      'Packaging',
      'Marking',
      'Result',
      'UserName',
      'Note'
    ];
  
    fields.forEach(field => {
      if (errors[field]) {
        const fieldKey = field.charAt(0).toLowerCase() + field.slice(1);
        mappedErrors[fieldKey] = errors[field];
      }
    });
  
    return mappedErrors;
  };