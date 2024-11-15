import { getCookie } from "../Infrastructure/getCookie";
import { PartyModel } from "@/Models/PartyModels/PartyModel";

export const GetUserAsync = async (): Promise<PartyModel | null> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5000/api/User/getUser`,
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
      const user: PartyModel = responseData.user;

      return user;
    } else {
      console.error("Failed to fetch user:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return null;
};
