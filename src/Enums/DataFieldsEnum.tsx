"use client";

export enum DataFieldsEnum {
  id = "Id",

  //UserModel
  role = "Роль",
  surname = "Фамилия",
  userName = "Имя",
  patronymic = "Отчество",
  email = "Почта",

  //ManufacturerModel
  manufacturerName = "Производитель",

  //SupplierModel
  supplierName = "Поставщик",

  //ProductModel
  productName = "Продукт",

  //PartyModel
  dateOfReceipt = "Дата получения",
  batchSize = "Размер партии",
  sampleSize = "Размер выборки",
  ttn = "ТТН",
  documentQuality = "Документ по качеству и безопасности",
  testReport = "Протокол испытаний",
  experements = "Эксперементы",
}
