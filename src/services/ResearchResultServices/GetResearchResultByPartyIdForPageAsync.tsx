import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";

export const GetResearchResultByPartyIdForPageAsync = async (
  partyId: string,
  pageNumber: number
): Promise<{ researchResults: ResearchResultModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5005/api/ResearchResult/researchResultByPartyIdForPage?partyId=${partyId}&pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
