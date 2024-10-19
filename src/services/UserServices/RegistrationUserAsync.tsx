import { RegistrationUserModelRequest } from "@/app/Models/RegistrationUserModelRequest";
import { setCookies } from "../Infrastructure/setCookies";
import { jwtDecode } from "jwt-decode";

export const RegistrationUserAsync = async (
  userRequest: RegistrationUserModelRequest
) => {
  console.log("Form submitted: ", userRequest);

  try {
    const response = await fetch(
      "https://localhost:7295/api/User/registration",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequest),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const token = responseData.token;

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp !== undefined && typeof decodedToken.exp === "number") {
        const expirationTime = decodedToken.exp * 1000;
        setCookies("jwtToken", token, expirationTime - Date.now());
      } else {
        console.warn("Token does not have an expiration time.");
        // Handle the case where exp is undefined (e.g., set a default value or throw an error)
      }
    }
    } else if (response.status === 400) {
      const validationErrors = await response.json();
      console.error("Registration failed:", validationErrors);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
};
