"use client";

export interface SupplierValidationErrorModel {
  [key: string]: string | undefined;
  supplierName?: string; 
  manufacturer?: string;
}