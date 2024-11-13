import { getCookie } from "../Infrastructure/getCookie";
import { PartyModel } from "@/Models/PartyModels/PartyModel";

export const GetUserPartiesForPageAsync = async (
  userId: string,
  pageNumber: number
): Promise<{ parties: PartyModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5000/api/Party/getUserPartiesForPage?userId=${userId}&pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const parties: PartyModel[] = responseData.parties;
      const countItemsAll: number = responseData.numberParties;

      return { parties, countItemsAll };
    } else {
      console.error("Failed to fetch parties:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { parties: [], countItemsAll: 0 };
};
