import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetSupplierProductsForPageAsync = async (
  supplierId: string,
  pageNumber: number
): Promise<{ products: ProductModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5004/api/Product/getSupplierProductsForPageAsync?supplierId=${supplierId}&pageNumber=${pageNumber}`,
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
      const products: ProductModel[] = responseData.products;
      const countItemsAll: number = responseData.numberProducts;

      return { products, countItemsAll };
    } else {
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { products: [], countItemsAll: 0 };
};
