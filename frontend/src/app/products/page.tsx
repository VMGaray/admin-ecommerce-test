"use client";

import { useEffect, useState } from "react";
import { ProductList } from "@/components/products/product-list";
import { CreateProductDialog } from "@/components/products/create-product-dialog";
import { Category } from "@/types";

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error al traer categorías para los filtros:", err);
      }
    };
    fetchCategories();
  }, [refreshKey]); 

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-500">Gestiona el inventario y precios de tu tienda.</p>
        </div>
        
        <CreateProductDialog onProductCreated={handleRefresh} categories={categories} />
      </div>

      <ProductList 
        refreshKey={refreshKey} 
        onRefresh={handleRefresh} 
        categories={categories} 
      />
    </div>
  );
}