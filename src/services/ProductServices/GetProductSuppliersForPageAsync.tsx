import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetProductSuppliersForPageAsync = async (
  productId: string,
  pageNumber: number
): Promise<{ suppliers: SupplierModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5003/api/Supplier/getProductSuppliersForPageAsync?productId=${productId}&pageNumber=${pageNumber}`,
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
      console.error("Failed to fetch products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { suppliers: [], countItemsAll: 0 };
};
