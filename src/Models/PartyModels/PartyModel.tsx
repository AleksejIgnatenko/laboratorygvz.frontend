"use client";

export interface PartyModel {
  id: string;
  batchNumber: string;
  dateOfReceipt: string;
  productName: string;
  supplierName: string;
  manufacturerName: string;
  batchSize: string;
  sampleSize: string;
  ttn: string;
  documentOnQualityAndSafety: string;
  testReport: string;
  dateOfManufacture: string;
  expirationDate: string;
  packaging: string;
  marking: string;
  result: string;
  responsible: string;
  note: string;
}

export function CanBeConvertedToNumberWithoutLeadingZero(value: string): boolean {
  const regex = /^(?!0)[0-9]*$/;
  return regex.test(value);
}

export function CanBeConvertedToNumberWithAnyDigits(value: string): boolean {
  const regex = /^[0-9]*$/;
  return regex.test(value);
}

export function CanBeConvertedToFloat(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num);
}

// export interface PartyModel {
//   id: string;
//   batchNumber: number;
//   dateOfReceipt: Date;
//   productName: string;
//   supplierName: string;
//   manufacturerName: string;
//   batchSize: number;
//   sampleSize: number;
//   ttn: number;
//   documentOnQualityAndSafety: string;
//   testReport: string;
//   dateOfManufacture: Date;
//   expirationDate: Date;
//   packaging: string;
//   marking: string;
//   result: string;
//   userName: string;
//   note: string;
// }