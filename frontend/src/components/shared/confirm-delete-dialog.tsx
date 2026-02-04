"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({ isOpen, onClose, onConfirm, title, description, isLoading }: ConfirmDeleteProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-100 rounded-2xl border-slate-200 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          {/* Icono de advertencia sutil */}
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle size={24} />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="rounded-xl border-slate-200 font-medium hover:bg-slate-50 focus-visible:ring-[#728d84]"
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isLoading}
            className="rounded-xl font-bold px-6 shadow-md shadow-red-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Eliminando...
              </>
            ) : (
              "Confirmar Eliminación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}