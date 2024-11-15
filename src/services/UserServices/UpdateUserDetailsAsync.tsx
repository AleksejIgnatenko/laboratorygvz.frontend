import { UpdateUserDetailsModel } from "@/Models/UserModels/UpdateUserDetailsModel";
import { getCookie } from "../Infrastructure/getCookie";

export const UpdateUserDetailsAsync = async (user: UpdateUserDetailsModel) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5000/api/User/updateUserDetails`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(user),
      }
    );

    if (response.ok) {
      return ["Измененния сохранены", 200];
    } else if (response.status === 400) {
      const validationErrors = await response.json();
      return [validationErrors.error, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update user:", error);
  }
  return ["Не получилось обновить пользователя", null];
};
