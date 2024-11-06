import { PartyErrorMapper } from "@/Mappers/PartyMapper/PartyErrorMapper";
import { CreatePartyRequest } from "@/Models/PartyModels/CreatePartyRequest";


export const AddPartyAsync = async (party: CreatePartyRequest) => {
  try {
    const response = await fetch("http://localhost:5006/api/Party", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(party),
    });

    if (response.ok) {
      return [`${party.batchNumber} добавлен`, 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = PartyErrorMapper(errors.error);

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
