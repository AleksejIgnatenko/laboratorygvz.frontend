import { ManufacturerModel } from "@/Models/ManufactureModels/ManufacturerModel";

export const GetManufacturersForPageAsync = async (
  pageNumber: number
): Promise<{ manufacturers: ManufacturerModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5002/api/Manufacturer?page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const manufacturers: ManufacturerModel[] = responseData.suppliers;
      const countItemsAll: number = responseData.numberSuppliers;

      return { manufacturers, countItemsAll };
    } else {
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { manufacturers: [], countItemsAll: 0 };
};
