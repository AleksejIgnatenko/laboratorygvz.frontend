import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetResearchResultByResearchIdForPageAsync = async (
  researchId: string,
  pageNumber: number
): Promise<{ researchResults: ResearchResultModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5005/api/ResearchResults/researchResultsByResearchIdForPage?researchId=${researchId}&pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const researchResults: ResearchResultModel[] = responseData.researchResults;
      const countItemsAll: number = responseData.numberResearchResults;

      return { researchResults, countItemsAll };
    } else {
      console.error("Failed to fetch research results:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { researchResults: [], countItemsAll: 0 };
};
