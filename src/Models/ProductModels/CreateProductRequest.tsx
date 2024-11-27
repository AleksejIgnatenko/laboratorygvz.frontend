"use client";

export interface CreateProductRequest {
  productName: string;
  unitsOfMeasurement: string;
  suppliersIds: string[];
}
