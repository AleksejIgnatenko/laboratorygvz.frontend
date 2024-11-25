import { getCookie } from "../Infrastructure/getCookie";

export const CreationOfAQualityAndSafetyCertificateAsync = async (partyId: string) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5005/api/Party/creationOfAQualityAndSafetyCertificate?partyId=${partyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (!response.ok) {
      alert(
        "При создании удостоверения качества и безопасности возникла ошибка"
      );
      console.error("Error exporting parties:", response.statusText);
      return;
    }

    // Создание URL для загруженного файла
    const blob = await response.blob(); // Получаем файл в виде Blob
    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob

    // Создаем временный элемент <a> для загрузки файла
    const a = document.createElement("a");
    a.href = url;
    a.download = "ResearchCertificate.docx"; // Имя файла, которое будет предложено для загрузки
    document.body.appendChild(a); // Добавляем элемент в DOM
    a.click(); // Имитируем клик
    a.remove(); // Удаляем элемент после скачивания
    window.URL.revokeObjectURL(url); // Освобождаем память
  } catch (error) {
    console.error(
      "Error creation of a quality and safety certificateAsync to Excel:",
      error
    );
  }
};
