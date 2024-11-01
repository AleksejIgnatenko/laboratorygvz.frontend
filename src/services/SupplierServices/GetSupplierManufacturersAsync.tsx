import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";

export const GetSupplierManufacturersAsync = async (supplierId: string): Promise<ManufacturerModel[]> => {
  try {
    const response = await fetch(
      `http://localhost:5002/api/Manufacturer/getSupplierManufacturers?supplierId=${supplierId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const manufacturers: ManufacturerModel[] = responseData;
      return manufacturers;
    } else {
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};