"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductForm } from "./product-form"; // El que armamos antes

export function CreateProductDialog({ onProductCreated }: { onProductCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Cargamos las categorías para el Select
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3001/categories")
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [isOpen]);

  const handleSubmit = async (formData: any) => {
    const res = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onProductCreated();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
        </DialogHeader>
        {/* Reutilizamos el formulario que definimos */}
        <ProductForm 
          categories={categories} 
          onSubmit={handleSubmit} 
          isLoading={false} 
        />
      </DialogContent>
    </Dialog>
  );
}