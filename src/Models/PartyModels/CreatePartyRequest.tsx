"use client";

export interface CreatePartyRequest {
  batchNumber: number;
  dateOfReceipt: string;
  productId: string;
  supplierId: string;
  manufacturerId: string;
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