import { PartyModel } from "@/Models/PartyModels/PartyModel";

export const GetPartiesForPageAsync = async (
  pageNumber: number
): Promise<{ parties: PartyModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5006/api/Party?pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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