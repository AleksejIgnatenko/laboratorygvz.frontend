import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
//import { getCookie } from "../Infrastructure/getCookie";

export const SearchManufacturersAsync = async (
  searchQuery: string,
  pageNumber: number
): Promise<{ manufacturers: ManufacturerModel[]; countItemsAll: number }> => {
  try {
    //const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5002/api/Manufacturer/searchManufacturers?searchQuery=${searchQuery}&pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `Bearer ${jwtToken}`,
        },
      }
    );

    console.log(response);

    if (response.ok) {
      const responseData = await response.json();
      const manufacturers: ManufacturerModel[] = responseData.manufacturers;
      const countItemsAll: number = responseData.numberManufacturers;

      return { manufacturers, countItemsAll };
    } else {
      console.error("Failed to fetch manufacturers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { manufacturers: [], countItemsAll: 0 };
};
