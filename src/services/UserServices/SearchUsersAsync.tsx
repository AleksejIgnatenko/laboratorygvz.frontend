import { getCookie } from "../Infrastructure/getCookie";
import { UserModel } from "@/Models/UserModels/UserModel";

export const SearchUsersAsync = async (
  searchQuery: string,
  pageNumber: number
): Promise<{ users: UserModel[]; countItemsAll: number }> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5000/api/User/searchUsers?searchUsers=${searchQuery}&pageNumber=${pageNumber}`,
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

      const users: UserModel[] = responseData.users;
      const countItemsAll: number = responseData.numberUsers;

      return { users, countItemsAll };
    } else {
      console.error("Failed to fetch users:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { users: [], countItemsAll: 0 };
};
