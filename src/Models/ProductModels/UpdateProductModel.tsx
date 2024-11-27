"use client";

export interface UpdateProductModel {
  id: string;
  productName: string;
  unitsOfMeasurement: string;
  suppliersIds: string[];
}