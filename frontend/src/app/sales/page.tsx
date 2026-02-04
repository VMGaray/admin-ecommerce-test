"use client";

import { useState } from "react";
import { SalesList } from "@/components/sales/sales-list";
import { CreateSaleDialog } from "@/components/sales/create-sale-dialog";

export default function SalesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ventas</h2>
          <p className="text-slate-500 text-sm">Historial de transacciones realizadas en el sistema.</p>
        </div>
          <CreateSaleDialog onSaleCreated={handleRefresh} />
      </div>
          <SalesList refreshKey={refreshKey} />
    </div>
  );
}