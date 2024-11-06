import { ProductErrorMapper } from "@/Mappers/ProductMapper/ProductErrorMapper";
import { UpdateProductModel } from "@/Models/ProductModels/UpdateProductModel";


export const UpdateProductAsync = async (product: UpdateProductModel) => {
  try {
    const response = await fetch(
      `http://localhost:5003/api/Product/${product.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    if (response.ok) {
      return ["Продукт обновлен", 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = ProductErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update product:", error);
  }
  return ["Не получилось обновить продукт", null];
};
