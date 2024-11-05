import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";

export const DeleteResearchesAsync = async (data: Set<ResearchModel>) => {
  const researchArray = Array.from(data);

  if (researchArray.length > 0) {
    try {
      const ids = researchArray.map((research) => research.id);

      const response = await fetch("http://localhost:5005/api/Research", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        alert("При удалении возникла ошибка");
        console.error("Error deleting suppliers:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  } else {
    console.log("No products available.");
  }
};
