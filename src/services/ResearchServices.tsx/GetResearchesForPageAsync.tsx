import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";

export const GetResearchesForPageAsync = async (
  pageNumber: number
): Promise<{ researches: ResearchModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5005/api/Research?pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const researches: ResearchModel[] = responseData.researches;
      const countItemsAll: number = responseData.numberResearches;

      return { researches, countItemsAll };
    } else {
      console.error("Failed to fetch researches:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { researches: [], countItemsAll: 0 };
};
