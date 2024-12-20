import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import { getCookie } from "../Infrastructure/getCookie";

export const DeleteResearchesAsync = async (data: Set<ResearchModel>) => {
  const researchArray = Array.from(data);

  if (researchArray.length > 0) {
    try {
    const jwtToken = getCookie("jwtToken");
    
      const ids = researchArray.map((research) => research.id);

      const response = await fetch("http://localhost:5005/api/Research", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        alert("При удалении возникла ошибка");
        console.error("Error deleting research:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting research:", error);
    }
  } else {
    console.log("No researches available.");
  }
};
