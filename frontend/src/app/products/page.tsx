"use client";

import { useState } from "react";
import { ProductList } from "@/components/products/product-list";
import { CreateProductDialog } from "@/components/products/create-product-dialog";

export default function ProductsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Productos</h2>
          <p className="text-slate-500 text-sm">Gestiona el inventario y precios de tu tienda.</p>
        </div>
        
        {/* Modal para crear productos */}
        <CreateProductDialog onProductCreated={handleRefresh} />
      </div>

      {/* Lista de productos con la tabla */}
      <ProductList refreshKey={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}