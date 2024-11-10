import { getCookie } from "../Infrastructure/getCookie";

export const IsManagerAsync = async () => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch("http://localhost:5000/api/User/IsManager", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
};