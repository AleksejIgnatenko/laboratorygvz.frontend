import { PartyModel } from "@/Models/PartyModels/PartyModel";

export const DeletePartiesAsync = async (data: Set<PartyModel>) => {
  const partyArray = Array.from(data);

  if (partyArray.length > 0) {
    try {
      const ids = partyArray.map((party) => party.id);

      const response = await fetch("http://localhost:5006/api/Party", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        alert("При удалении возникла ошибка");
        console.error("Error deleting party:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting party:", error);
    }
  } else {
    console.log("No parties available.");
  }
};
