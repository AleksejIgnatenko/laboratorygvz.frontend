import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";

export const GetProductResearchesForPageAsync = async (
  productId: string,
  pageNumber: number
): Promise<{ researches: ResearchModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5003/api/Research/getProductResearchesForPageAsync?productId=${productId}&pageNumber=${pageNumber}`,
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
      console.error("Failed to fetch products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { researches: [], countItemsAll: 0 };
};
