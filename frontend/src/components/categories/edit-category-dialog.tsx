"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface EditCategoryProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
}

export function EditCategoryDialog({ category, isOpen, onClose, onCategoryUpdated }: EditCategoryProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizamos el estado interno con la categoría seleccionada
  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/categories/${category.id}`, {
        method: "PATCH", // Usamos PATCH para actualizaciones parciales
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        onCategoryUpdated(); // Refrescamos la lista en el padre
        onClose(); // Cerramos el modal
      }
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Nombre</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}