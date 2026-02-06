"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm, CategoryFormValues } from "./CategoryForm";

export function CreateCategoryDialog({ onCategoryCreated }: { onCategoryCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);
        onCategoryCreated();
      } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData.message); 
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[#728d84] hover:bg-[#617971] text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium active:scale-95 text-sm">
          <PlusCircle size={18} /> Nueva Categoría
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-100 rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Agregar Nueva Categoría</DialogTitle>
        </DialogHeader>
         <div className="py-4">
          <CategoryForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}