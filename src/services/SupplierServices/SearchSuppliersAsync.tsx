import { getCookie } from "../Infrastructure/getCookie";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";

export const SearchSuppliersAsync = async (
  searchQuery: string,
  pageNumber: number
): Promise<{ suppliers: SupplierModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5004/api/Supplier/searchSuppliers?searchQuery=${searchQuery}&pageNumber=${pageNumber}`,
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
      const suppliers: SupplierModel[] = responseData.suppliers;
      const countItemsAll: number = responseData.numberSuppliers;

      return { suppliers, countItemsAll };
    } else {
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { suppliers: [], countItemsAll: 0 };
};
