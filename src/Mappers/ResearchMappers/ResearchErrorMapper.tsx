export const ResearchErrorMapper = (errors: Record<string, string>): Record<string, string> => {
    const mappedErrors: Record<string, string> = {};
  
    if (errors.ResearchName) {
      mappedErrors.researchName = errors.ResearchName;
    }
  
    return mappedErrors;
  };
  