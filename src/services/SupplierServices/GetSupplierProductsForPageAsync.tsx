import { ProductModel } from "@/Models/ProductModels/ProductModel";

export const GetSupplierProductsForPageAsync = async (
  supplierId: string,
  pageNumber: number
): Promise<{ products: ProductModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5004/api/Product/getSupplierProductsForPageAsync?supplierId=${supplierId}&pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
