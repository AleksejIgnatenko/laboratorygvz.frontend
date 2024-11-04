import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";

export const GetProductSuppliersAsync = async (
  productId: string
): Promise<SupplierModel[]> => {
  try {
    const response = await fetch(
      `http://localhost:5003/api/Supplier/getProductSuppliers?productId=${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
