"use client";

export interface PartyValidationErrorModel {
  [key: string]: string | undefined;
  batchNumber?: string;
  dateOfReceipt?: string;
  productName?: string;
  supplierName?: string;
  manufacturerName?: string;
  batchSize?: string;
  sampleSize?: string;
  ttn?: string;
  documentOnQualityAndSafety?: string;
  testReport?: string;
  dateOfManufacture?: string;
  expirationDate?: string;
  packaging?: string;
  marking?: string;
  result?: string;
  userName?: string;
  note?: string;
}