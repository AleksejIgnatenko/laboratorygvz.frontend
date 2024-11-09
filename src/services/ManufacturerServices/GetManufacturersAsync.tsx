import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import { getCookie } from "../Infrastructure/getCookie";

export const GetManufacturersAsync = async (): Promise<ManufacturerModel[]> => {
  try {

    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      "http://localhost:5002/api/Manufacturer/getManufacturersAsync",
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
      const manufacturers: ManufacturerModel[] = responseData;
      return manufacturers;
    } else {
      console.error("Failed to fetch manufacturers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};
