import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetProductsAsync = async (): Promise<ProductModel[]> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      "http://localhost:5003/api/Product/getProductsAsync",
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
