"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => void;
  initialData?: { name: string };
  isLoading: boolean;
}

export function CategoryForm({ onSubmit, initialData, isLoading }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || { name: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-medium">Nombre de la Categoría</Label>
        <Input 
          id="name" 
          {...register("name")} 
          className="focus-visible:ring-[#728d84] border-slate-200 rounded-xl" 
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-[#728d84] hover:bg-[#617971] text-white font-bold h-11 rounded-xl transition-all flex items-center justify-center disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Guardar Cambios"}
      </button>
    </form>
  );
}