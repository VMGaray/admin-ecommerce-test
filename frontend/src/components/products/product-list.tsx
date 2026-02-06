"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit, Package, Search, Filter } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { Product, Category } from "@/types"; 


export function ProductList({ 
  refreshKey, 
  onRefresh, 
  categories = [] 
}: { 
  refreshKey: number, 
  onRefresh: () => void,
  categories: Category[]
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
 
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) { 
      console.error("Error al cargar productos:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProducts(); }, [refreshKey]);


  const filteredProducts = products.filter((prod) => {
    const matchesName = prod.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || prod.categoryId === categoryFilter;
    const matchesStock = 
      stockFilter === "all" || 
      (stockFilter === "low" && prod.stock <= 5 && prod.stock > 0) ||
      (stockFilter === "out" && prod.stock === 0);
    
    return matchesName && matchesCategory && matchesStock;
  });

  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar por nombre..." 
            className="pl-10 rounded-xl border-slate-200 focus-visible:ring-[#728d84]" 
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        <Select onValueChange={setCategoryFilter} defaultValue="all">
          <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#728d84]">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <SelectValue placeholder="Categoría" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setStockFilter} defaultValue="all">
          <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#728d84]">
            <SelectValue placeholder="Estado de Stock" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todo el stock</SelectItem>
            <SelectItem value="low" className="text-amber-600 font-medium">Bajo Stock (≤ 5)</SelectItem>
            <SelectItem value="out" className="text-red-600 font-medium">Sin Stock (0)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4 w-24 text-center">Imagen</TableHead>
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">Nombre</TableHead>
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">Categoría</TableHead>
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">Precio</TableHead>
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">Stock</TableHead>
              <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-32"><Loader2 className="animate-spin inline mr-2 text-[#728d84]"/> Cargando...</TableCell></TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-32 text-slate-400 italic">No se encontraron productos con esos filtros.</TableCell></TableRow>
            ) : filteredProducts.map((prod) => (
              <TableRow key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="px-6 flex justify-center">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {prod.imageUrl ? (
                      <Image src={prod.imageUrl} alt={prod.name} fill className="object-cover" sizes="48px" />
                    ) : ( <Package className="text-slate-400" size={24} /> )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-900 px-6">{prod.name}</TableCell>
                <TableCell className="px-6">
                  <Badge variant="outline" className="bg-[#728d84]/10 text-[#728d84] border-[#728d84]/20">
                    {prod.category?.name || "Sin categoría"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-slate-700 px-6">{currencyFormatter.format(prod.price)}</TableCell>
                <TableCell className="px-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${prod.stock <= 5 ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-700"}`}>
                    {prod.stock} u.
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1 px-6">
                  <Button variant="ghost" size="icon" className="text-[#728d84] hover:bg-green-50" onClick={() => setProductToEdit(prod)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => setProductToDelete(prod)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {productToEdit && (
        <EditProductDialog product={productToEdit} isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} onProductUpdated={onRefresh} />
      )}
      <ConfirmDeleteDialog 
        isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} 
        onConfirm={async () => {
          if (!productToDelete) return;
          await fetch(`http://localhost:3001/products/${productToDelete.id}`, { method: "DELETE" });
          onRefresh(); setProductToDelete(null);
        }} 
        title="¿Eliminar producto?" description={`Borrarás "${productToDelete?.name}".`} 
      />
    </div>
  );
}