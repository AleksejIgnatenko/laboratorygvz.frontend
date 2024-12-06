import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetProductResearchesForPageAsync = async (
  productId: string,
  pageNumber: number
): Promise<{ researches: ResearchModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5005/api/Research/getResearchesByProductIdForPage?productId=${productId}&pageNumber=${pageNumber}`,
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
