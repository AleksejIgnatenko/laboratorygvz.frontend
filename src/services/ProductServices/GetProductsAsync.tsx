import { ProductModel } from "@/Models/ProductModels/ProductModel";

export const GetProductsAsync = async (): Promise<ProductModel[]> => {
  try {
    const response = await fetch(
      'http://localhost:5003/api/Product/getProductsAsync',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const products: ProductModel[] = responseData;
      return products;
    } else {
      console.error("Failed to fetch products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};
