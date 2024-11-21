"use client";

export interface AddPartyModel {
  batchNumber: number;
  dateOfReceipt: string;
  batchSize: number;
  sampleSize: number;
  ttn: number;
  documentOnQualityAndSafety: string;
  testReport: string;
  dateOfManufacture: string;
  expirationDate: string;
  packaging: string;
  marking: string;
  result: string;
  note: string;
}