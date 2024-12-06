import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { getCookie } from "../Infrastructure/getCookie";

export const DeleteProductsAsync = async (data: Set<ProductModel>) => {
  const productArray = Array.from(data);

  if (productArray.length > 0) {
    try {
      const ids = productArray.map((product) => product.id);
      const jwtToken = getCookie("jwtToken");

      const response = await fetch("http://localhost:5003/api/Product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        alert("При удалении возникла ошибка");
        console.error("Error deleting products:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  } else {
    console.log("No products available.");
  }
};
