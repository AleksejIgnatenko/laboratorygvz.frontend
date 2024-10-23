"use client";

export interface ProductModel {
  id: number;
  dateOfReceipt: string;
  productName: string;
  providerId: string;
  batchSize: number;
  sampleSize: number;
  ttn: number;
  documentQuality: number;
  testReport: string;
  experements: string;
}