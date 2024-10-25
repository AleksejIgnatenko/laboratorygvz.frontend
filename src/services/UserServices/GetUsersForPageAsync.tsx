import { UserModel } from "@/app/Models/UserModel";

export const GetUsersForPageAsync = async (
  pageNumber: number
): Promise<{ users: UserModel[]; countItemsAll: number }> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/User/getUsersForPage?page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      
      const users: UserModel[] = responseData.users;
      const countItemsAll: number = responseData.countUser;

      return { users, countItemsAll };
    } else {
      console.error("Failed to fetch users:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return { users: [], countItemsAll: 0 }; // Return an empty array and zero count in case of error
};