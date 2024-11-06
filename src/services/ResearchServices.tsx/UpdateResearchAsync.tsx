import { ResearchErrorMapper } from "@/Mappers/ResearchMappers/ResearchErrorMapper";
import { UpdateResearchModel } from "@/Models/ResearchModels/UpdateResearchModel";

export const UpdateResearchAsync = async (research: UpdateResearchModel) => {
  try {
    const response = await fetch(
      `http://localhost:5005/api/Research/${research.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(research),
      }
    );

    if (response.ok) {
      return ["Исселодование обновлено", 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = ResearchErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update research:", error);
  }
  return ["Не получилось обновить исследование", null];
};
