import { ProductModel } from "@/Models/ProductModels/ProductModel";

export const GetProductForResearchId = async (
  researchId: string
): Promise<ProductModel | null> => {
  try {
    const response = await fetch(
      `http://localhost:5005/api/Product/getProductForResearchId?researchId=${researchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const product: ProductModel = responseData;
      return product;
    } else {
      console.error("Failed to fetch products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return null;
};
