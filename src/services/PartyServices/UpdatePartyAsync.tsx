import { PartyErrorMapper } from "@/Mappers/PartyMapper/PartyErrorMapper";
import { UpdatePartyModel } from "@/Models/PartyModels/UpdatePartyModel";
import { getCookie } from "../Infrastructure/getCookie";


export const UpdatePartyAsync = async (party: UpdatePartyModel) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5006/api/Party/${party.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(party),
      }
    );

    if (response.ok) {
      return ["Партия обновлена", 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = PartyErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update party:", error);
  }
  return ["Не получилось обновить партию", null];
};
