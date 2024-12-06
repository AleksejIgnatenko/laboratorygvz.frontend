import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetSuppliersAsync = async (): Promise<SupplierModel[]> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      "http://localhost:5004/api/Supplier/getSuppliersAsync",
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
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};
