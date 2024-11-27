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
  unitsOfMeasurement = "Единицы измерения",

  //ResearchModel
  researchName = "Название исследования",

  //PartyModel
  batchNumber = "Номер партии",
  dateOfReceipt = "Дата получения",
  batchSize = "Размер партии",
  sampleSize = "Размер выборки",
  ttn = "ТТН",
  documentOnQualityAndSafety = "Документ по качеству и безопасности",
  testReport = "Протокол испытаний",
  dateOfManufacture = "Дата изготовления",
  expirationDate = "Срок годности",
  packaging = "Упаковка",
  marking = "Маркировка",
  result = "Заключение",
  responsible = "Ответственный",
  note = "Примечание",
}
