"use client";

import { useState } from "react";
import { CategoryList } from "@/components/categories/category-list";
import { CreateCategoryDialog } from "@/components/categories/CreateCategoryDialog";

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Categorías</h2>
          <p className="text-slate-500 text-sm">Gestiona las categorías de tus productos.</p>
        </div>
          <CreateCategoryDialog onCategoryCreated={handleRefresh} />
      </div>
          <CategoryList refreshKey={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}