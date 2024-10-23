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

export default function isProductModel(data: any): data is ProductModel {
  return (
    data &&
    typeof data.id === 'number' &&
    typeof data.dateOfReceipt === 'string' &&
    typeof data.productName === 'string' &&
    typeof data.providerId === 'string' &&
    typeof data.batchSize === 'number' &&
    typeof data.sampleSize === 'number' &&
    typeof data.ttn === 'number' &&
    typeof data.documentQuality === 'number' &&
    typeof data.testReport === 'string' &&
    typeof data.experements === 'string'
  );
}
