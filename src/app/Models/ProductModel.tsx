"use client";

export interface ProductModel {
  id: number;
  dateOfReceipt: string;
  name: string;
  providerId: string;
  batchSize: number;
  sampleSize: number;
  ttn: number;
  documentQuality: number;
  testReport: string;
  experements: string;
}
