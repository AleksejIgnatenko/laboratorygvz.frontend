import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";

export const GetManufacturersForPageAsync = async (
  pageNumber: number
): Promise<{ manufacturers: ManufacturerModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5002/api/Manufacturer?pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const manufacturers: ManufacturerModel[] = responseData.manufacturers;
      const countItemsAll: number = responseData.numberManufacturers;

      return { manufacturers, countItemsAll };
    } else {
      console.error("Failed to fetch manufacturers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { manufacturers: [], countItemsAll: 0 };
};
