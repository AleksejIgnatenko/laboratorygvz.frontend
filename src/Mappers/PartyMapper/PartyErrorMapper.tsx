export const PartyErrorMapper = (
  errors: Record<string, string>
): Record<string, string> => {
  const mappedErrors: Record<string, string> = {};

  if (errors.BatchNumber) {
    mappedErrors.batchNumber = errors.BatchNumber;
  }

  if (errors.DateOfReceipt) {
    mappedErrors.dateOfReceipt = errors.DateOfReceipt;
  }

  if (errors.BatchSize) {
    mappedErrors.batchSize = errors.BatchSize;
  }

  if (errors.SampleSize) {
    mappedErrors.sampleSize = errors.SampleSize;
  }

  if (errors.Ttn) {
    mappedErrors.ttn = errors.Ttn;
  }

  if (errors.DocumentOnQualityAndSafety) {
    mappedErrors.documentOnQualityAndSafety = errors.DocumentOnQualityAndSafety;
  }

  if (errors.TestReport) {
    mappedErrors.testReport = errors.TestReport;
  }

  if (errors.DateOfManufacture) {
    mappedErrors.dateOfManufacture = errors.DateOfManufacture;
  }

  if (errors.ExpirationDate) {
    mappedErrors.expirationDate = errors.ExpirationDate;
  }

  if (errors.Packaging) {
    mappedErrors.packaging = errors.Packaging;
  }

  if (errors.Marking) {
    mappedErrors.marking = errors.Marking;
  }

  if (errors.Result) {
    mappedErrors.result = errors.Result;
  }

  if (errors.Note) {
    mappedErrors.note = errors.Note;
  }
  return mappedErrors;
};
