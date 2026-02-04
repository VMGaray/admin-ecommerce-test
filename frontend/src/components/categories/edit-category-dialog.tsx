"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Category } from "@/types";

interface EditCategoryProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
}

export function EditCategoryDialog({ category, isOpen, onClose, onCategoryUpdated }: EditCategoryProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/categories/${category.id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        onCategoryUpdated(); 
        onClose(); 
      }
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const focusClasses = "focus-visible:ring-[#728d84] focus:ring-[#728d84]";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 rounded-2xl">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Editar Categoría</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name" className="text-slate-700 font-semibold ml-1">
                Nombre de la Categoría
              </Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={`bg-slate-50 border-slate-200 h-11 ${focusClasses}`}
                placeholder="Ej: Electrónica"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="rounded-xl border-slate-200"
            >
              Cancelar
            </Button>
        
            <Button 
              type="submit" 
              disabled={isLoading || !name.trim()}
              className="bg-[#728d84] hover:bg-[#617971] text-white font-bold px-6 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}