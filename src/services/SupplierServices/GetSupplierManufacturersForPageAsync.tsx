import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";

export const GetSupplierManufacturersForPageAsync = async (
  supplierId: string,
  pageNumber: number
): Promise<{ manufacturers: ManufacturerModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5004/api/Manufacturer/getSupplierManufacturersForPage?supplierId=${supplierId}&pageNumber=${pageNumber}`,
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
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { manufacturers: [], countItemsAll: 0 };
};
