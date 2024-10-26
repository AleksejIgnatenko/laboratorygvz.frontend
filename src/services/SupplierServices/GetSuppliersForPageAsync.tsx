import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";

export const GetSuppliersForPageAsync = async (
  pageNumber: number
): Promise<{ suppliers: SupplierModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5004/api/Supplier?page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();

      const suppliers: SupplierModel[] = responseData.suppliers;
      const countItemsAll: number = responseData.numberUsers;

      return { suppliers, countItemsAll };
    } else {
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { suppliers: [], countItemsAll: 0 };
};
