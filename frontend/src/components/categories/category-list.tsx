"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit, Filter } from "lucide-react";
import { Category } from "@/types";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

export function CategoryList({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [selectedId, setSelectedId] = useState<string>("all"); 
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) { 
      console.error("Error al cargar categorías:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchCategories(); }, [refreshKey]);

  const filteredCategories = selectedId === "all" 
    ? categories 
    : categories.filter(cat => cat.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Filter size={18} className="text-[#728d84]" />
        <Select onValueChange={setSelectedId} defaultValue="all">
          <SelectTrigger className="w-70 border-slate-200 focus:ring-[#728d84] rounded-xl bg-white shadow-sm font-medium text-slate-600">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="font-semibold text-[#728d84]">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">
                Nombre de la Categoría
              </TableHead>
              <TableHead className="bg-[#728d84] text-right font-semibold text-white px-6">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-32">
                  <Loader2 className="animate-spin inline mr-2 text-[#728d84]"/>
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-700 bg-green-50/30 px-6">
                    {cat.name}
                  </TableCell>
                  <TableCell className="text-right space-x-1 px-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[#728d84] hover:bg-green-50"
                      onClick={() => setCategoryToEdit(cat)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => setCategoryToDelete(cat)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-24 text-slate-400 italic">
                  No hay datos para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDeleteDialog 
        isOpen={!!categoryToDelete} 
        onClose={() => setCategoryToDelete(null)} 
        onConfirm={async () => {
          if (!categoryToDelete) return;
          await fetch(`http://localhost:3001/categories/${categoryToDelete.id}`, { method: "DELETE" });
          onRefresh();
          setCategoryToDelete(null);
        }} 
        title="¿Eliminar categoría?" 
        description={`Se borrará la categoría "${categoryToDelete?.name}".`} 
      />

      {categoryToEdit && (
        <EditCategoryDialog 
          category={categoryToEdit}
          isOpen={!!categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
          onCategoryUpdated={onRefresh}
        />
      )}
    </div>
  );
}