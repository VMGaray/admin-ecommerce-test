"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit } from "lucide-react";
import { ConfirmDeleteDialog } from "../shared/confirm-delete-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { Category } from "@/types";

export function CategoryList({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [refreshKey]);

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await fetch(`http://localhost:3001/categories/${categoryToDelete.id}`, { method: "DELETE" });
      onRefresh();
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <Table className="min-w-150 md:min-w-full">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-32">
                  <Loader2 className="animate-spin inline mr-2 text-[#728d84]"/> Cargando...
                </TableCell>
              </TableRow>
            ) : categories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-[10px] text-slate-400">
                  {cat.id.split('-')[0]}...
                </TableCell>
                <TableCell className="font-medium text-slate-700">{cat.name}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-[#728d84] hover:bg-green-50"
                    onClick={() => setCategoryToEdit(cat)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                    onClick={() => setCategoryToDelete(cat)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditCategoryDialog 
        category={categoryToEdit}
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        onCategoryUpdated={onRefresh}
      />

      <ConfirmDeleteDialog 
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar categoría?"
        description={`Estás por borrar "${categoryToDelete?.name}". Esta acción no se puede deshacer.`}
      />
    </>
  );
}