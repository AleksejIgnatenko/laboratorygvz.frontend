import { ProductModelOption } from "@/Models/ProductModels/ProductModelOption";

export const GetProductsForOptionsAsync = async (): Promise<ProductModelOption[]> => {
  try {
    const response = await fetch(
      "http://localhost:5003/api/Product/getProductsForOptions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const products: ProductModelOption[] = responseData;
      return products;
    } else {
      console.error("Failed to fetch products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};
