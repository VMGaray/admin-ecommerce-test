"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { Product, Category, CreateProductInput } from "@/types";

interface EditProductProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
}

export function EditProductDialog({ product, isOpen, onClose, onProductUpdated }: EditProductProps) {
  const [categories, setCategories] = useState<Category[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3001/categories")
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error("Error al cargar categorías:", err));
    }
  }, [isOpen]);

  const handleSubmit = async (formData: CreateProductInput) => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onProductUpdated();
        onClose();
      }
    } catch (err) {
      console.error("Error al actualizar producto:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 rounded-2xl border-slate-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Editar Producto: <span className="text-[#728d84]">{product?.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ProductForm 
          categories={categories} 
          initialData={product} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
}