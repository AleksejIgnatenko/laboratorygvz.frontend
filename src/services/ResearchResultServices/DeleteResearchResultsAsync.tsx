import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";
import { getCookie } from "../Infrastructure/getCookie";

export const DeleteResearchResultsAsync = async (data: Set<ResearchResultModel>) => {
  const researchResultsArray = Array.from(data);
  if (researchResultsArray.length > 0) {
    try {
      const jwtToken = getCookie("jwtToken");

      const ids = researchResultsArray.map((researchResult) => researchResult.id);

      const response = await fetch(
        "http://localhost:5005/api/ResearchResults",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(ids),
        }
      );

      if (!response.ok) {
        alert("При удалении возникла ошибка");
        console.error("Error deleting research:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting research:", error);
    }
  } else {
    console.log("No researches available.");
  }
};
