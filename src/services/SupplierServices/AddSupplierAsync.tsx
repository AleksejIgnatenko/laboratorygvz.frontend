import { AddSupplierModel } from "@/Models/SupplierModels/AddSupplierModel";

export const AddSupplierAsync = async (
  supplier: AddSupplierModel
): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5004/api/Supplier', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplier),
    });

    console.log(supplier);

    if (response.ok) {
      alert("Поставщик добавлен");
    } else if (response.status === 400) {
      const errors = await response.json();
      return errors.error;
    } else if (response.status === 409) {
      const errors = await response.json();
      return errors.error;
    }
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
  return "Не получилось добавить поставщика";
};
