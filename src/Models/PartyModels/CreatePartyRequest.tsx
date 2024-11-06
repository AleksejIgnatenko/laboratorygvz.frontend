"use client";

export interface CreatePartyRequest {
    batchNumber: number;
    dateOfReceipt: Date;
    productId: string;
    supplierId: string;
    manufacturerId: string;
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
    // userName: string;
    note: string;
}
