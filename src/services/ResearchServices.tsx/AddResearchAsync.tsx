import { ResearchErrorMapper } from "@/Mappers/ResearchMappers/ResearchErrorMapper";
import { CreateResearchRequest } from "@/Models/ResearchModels/CreateResearchRequest";


export const AddResearchAsync = async (research: CreateResearchRequest) => {
  try {
    const response = await fetch("http://localhost:5005/api/Research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(research),
    });

    if (response.ok) {
      return [`${research.researchName} добавлен`, 200];
    } else if (response.status === 400) {
      const errors = await response.json();
      const mappedErrors = ResearchErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error adding research:", error);
  }
  return ["Не получилось добавить исследование", null];
};
