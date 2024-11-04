import { ProductErrorMapper } from "@/Mappers/ProductMapper/ProductErrorMapper";
import { CreateProductRequest } from "@/Models/ProductModels/CreateProductRequest";


export const AddProductAsync = async (product: CreateProductRequest) => {
  try {
    const response = await fetch("http://localhost:5003/api/Supplier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      return [`${product.productName} добавлен`, 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = ProductErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
  return ["Не получилось добавить поставщика", null];
};
