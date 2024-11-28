import { getCookie } from "../Infrastructure/getCookie";

export const ExportManufacturersToExcelAsync = async () => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      "http://localhost:5002/api/Manufacturer/exportManufacturersToExcel",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (!response.ok) {
      alert("При экспорте возникла ошибка");
      console.error("Error exporting manufacturers:", response.statusText);
      return;
    }

    // Создание URL для загруженного файла
    const blob = await response.blob(); // Получаем файл в виде Blob
    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob

    // Создаем временный элемент <a> для загрузки файла
    const a = document.createElement("a");
    a.href = url;
    a.download = "manufacturers.xlsx"; // Имя файла, которое будет предложено для загрузки
    document.body.appendChild(a); // Добавляем элемент в DOM
    a.click(); // Имитируем клик
    a.remove(); // Удаляем элемент после скачивания
    window.URL.revokeObjectURL(url); // Освобождаем память
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};