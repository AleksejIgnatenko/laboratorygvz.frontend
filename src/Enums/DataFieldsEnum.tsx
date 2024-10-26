"use client";

export enum DataFieldsEnum {
  id = "Id",

  //UserModel
  role = "Роль",
  surname = "Фамилия",
  userName = "Имя",
  patronymic = "Отчество",
  email = "Почта",

  //SupplierModel
  supplierName = "Поставщик",
  manufacturer = "Производитель",

  //ProductModel
  dateOfReceipt = "Дата получения",
  productName = "Название",
  //providerId = "Поставщик",
  batchSize = "Размер партии",
  sampleSize = "Размер выборки",
  ttn = "ТТН",
  documentQuality = "Документ по качеству и безопасности",
  testReport = "Протокол испытаний",
  experements = "Эксперементы",
}
