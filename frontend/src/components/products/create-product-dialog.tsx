"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProductForm } from "./product-form";
import { CreateProductInput,} from "@/types";


export function CreateProductDialog({ onProductCreated }: { onProductCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3001/categories")
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error("Error cargando categorías:", err));
    }
  }, [isOpen]);

  const handleSubmit = async (formData: CreateProductInput) => {
    setIsSubmitting(true);
    try {
       const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onProductCreated(); 
        setIsOpen(false); 
      } else {
        console.error("Error al crear el producto");
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[#728d84] hover:bg-[#617971] text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium active:scale-95 text-sm">
          <Plus size={18} /> Nuevo Producto
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Crear Nuevo Producto</DialogTitle>
        </DialogHeader>
        
        <ProductForm 
          categories={categories} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}