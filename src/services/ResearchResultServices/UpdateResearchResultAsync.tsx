import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";
import { getCookie } from "../Infrastructure/getCookie";


export const UpdateResearchResultAsync = async (
  researchResult: ResearchResultModel
) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5005/api/ResearchResults/${researchResult.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(researchResult),
      }
    );

    if (response.ok) {
      return ["Результат исследования сохранен", 200];
    } else if (response.status === 400) {
      const errors = await response.json();
        console.log(errors.error);
      //const mappedErrors = ResearchErrorMapper(errors.error);

      return [errors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update research:", error);
  }
  return ["Не получилось обновить исследование", null];
};
