"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Category } from "@/types";

const productSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  price: z.preprocess((val) => Number(val), z.number().min(0.01, "Precio requerido")),
  categoryId: z.string().min(1, "Seleccioná una categoría"),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  stock: z.preprocess((val) => Number(val), z.number().min(0).optional().default(0)),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: ProductFormValues) => void;
  initialData?: Partial<ProductFormValues>;
  isLoading: boolean;
}

export function ProductForm({ categories, onSubmit, initialData, isLoading }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || { name: "", price: 0, stock: 0, categoryId: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label>Nombre del Producto</Label>
          <Input {...register("name")} className="rounded-xl focus-visible:ring-[#728d84]" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Precio ($)</Label>
          <Input type="number" step="0.01" {...register("price")} className="rounded-xl focus-visible:ring-[#728d84]" />
        </div>

        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select onValueChange={(val) => setValue("categoryId", val)} defaultValue={initialData?.categoryId}>
            <SelectTrigger className="rounded-xl focus:ring-[#728d84]">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>URL de Imagen</Label>
        <Input {...register("imageUrl")} className="rounded-xl focus-visible:ring-[#728d84]" placeholder="https://..." />
      </div>
      <div className="p-3 bg-green-50/50 rounded-xl border border-green-100">
        <Label className="text-[#728d84] font-bold text-xs uppercase tracking-wider">Mejora: Control de Stock</Label>
        <Input type="number" {...register("stock")} className="mt-2 bg-white rounded-lg border-green-200" />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-[#728d84] hover:bg-[#617971] text-white font-bold h-11 rounded-xl transition-all flex items-center justify-center"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Guardar Producto"}
      </button>
    </form>
  );
}