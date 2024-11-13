import { RegistrationUserModelRequest } from "@/Models/UserModels/RegistrationUserModelRequest";
import { setCookies } from "../Infrastructure/setCookies";
import { jwtDecode } from "jwt-decode";

export const RegistrationUserAsync = async (
  userRequest: RegistrationUserModelRequest
) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/User/registration",
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
        if (
          decodedToken.exp !== undefined &&
          typeof decodedToken.exp === "number"
        ) {
          const expirationTime = decodedToken.exp * 1000;
          setCookies("jwtToken", token, expirationTime - Date.now());
        } else {
          console.warn("Token does not have an expiration time.");
        }
      }
      return [`${userRequest.email} зарегистрирован`, 200];
    } else if (response.status === 400) {
      const validationErrors = await response.json();
      return [validationErrors.error, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error fetching:", error);
    return ["Не удалось зарегистрировать пользователя", null];
  }

  return ["Не удалось выполнить запрос", null];
};
