import { getCookie } from "../Infrastructure/getCookie";
import { UpdateUserModel } from "@/Models/UserModels/UpdateUserModel";

export const UpdateUserAsync = async (user: UpdateUserModel) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5000/api/User/${user.id}`,
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
      return ["Пользователь обновлен", 200];
    } else if (response.status === 400) {
      const errors = await response.json();
      console.log(errors)

      return ["mappedErrors", 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update user:", error);
  }
  return ["Не получилось обновить пользователя", null];
};
