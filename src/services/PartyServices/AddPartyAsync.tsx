import { PartyErrorMapper } from "@/Mappers/PartyMapper/PartyErrorMapper";
import { CreatePartyRequest } from "@/Models/PartyModels/CreatePartyRequest";
import { getCookie } from "../Infrastructure/getCookie";


export const AddPartyAsync = async (party: CreatePartyRequest) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch("http://localhost:5006/api/Party", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(party),
    });

    if (response.ok) {
      return [`${party.batchNumber} добавлен`, 200];
    } else if (response.status === 400) {
      const errors = await response.json();
            console.log(errors.error);
      const mappedErrors = PartyErrorMapper(errors.error);
      console.log(mappedErrors);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error adding party:", error);
  }
  return ["Не получилось добавить партию", null];
};
