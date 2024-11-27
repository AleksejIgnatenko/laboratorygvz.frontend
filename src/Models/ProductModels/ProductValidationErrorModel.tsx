"use client";

export interface ProductValidationErrorModel {
  [key: string]: string | undefined;
  productName?: string;
  unitsOfMeasurement?: string;
}