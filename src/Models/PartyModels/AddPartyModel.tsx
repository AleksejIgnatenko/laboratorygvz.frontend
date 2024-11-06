"use client";

export interface AddPartyModel {
  batchNumber: number;
  dateOfReceipt: Date;
  batchSize: number;
  sampleSize: number;
  ttn: number;
  documentOnQualityAndSafety: string;
  testReport: string;
  dateOfManufacture: Date;
  expirationDate: Date;
  packaging: string;
  marking: string;
  result: string;
  note: string;
}
