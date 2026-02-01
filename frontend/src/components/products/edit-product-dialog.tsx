"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "../../components/products/product-form";

export function EditProductDialog({ product, isOpen, onClose, onProductUpdated }: any) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3001/categories")
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [isOpen]);

  const handleSubmit = async (formData: any) => {
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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
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