"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ListContent() {
  const searchParams = useSearchParams();
  const [tableName, setTableName] = useState("");
  const [supplierId, setSupplierId] = useState<string | null>(null);

  useEffect(() => {
    const tableNameParam = searchParams.get("tableName");
    const supplierIdParam = searchParams.get("supplierId");

    setTableName(tableNameParam || "");
    setSupplierId(supplierIdParam);
  }, [searchParams]);

  return (
    <div className="get-manufacturers-page">
      <h1>{tableName}</h1>
      {supplierId && <p>Supplier ID: {supplierId}</p>}
    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListContent />
    </Suspense>
  );
}
