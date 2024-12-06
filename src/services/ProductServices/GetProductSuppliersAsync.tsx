import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetProductSuppliersAsync = async (
  productId: string
): Promise<SupplierModel[]> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5003/api/Supplier/getProductSuppliers?productId=${productId}`,
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
      const suppliers: SupplierModel[] = responseData;
      return suppliers;
    } else {
      console.error("Failed to fetch products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};
