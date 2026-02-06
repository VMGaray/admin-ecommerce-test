"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm, CategoryFormValues } from "./CategoryForm";
import { Category } from "@/types";

interface EditCategoryProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
}

export function EditCategoryDialog({ category, isOpen, onClose, onCategoryUpdated }: EditCategoryProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onCategoryUpdated();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-100 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Categoría</DialogTitle>
        </DialogHeader>
        <CategoryForm 
          onSubmit={handleSubmit} 
          initialData={{ name: category.name }} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
}