"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ReceiptText } from "lucide-react";
import { Sale } from "@/types"; // Usamos tu interface

export function SalesList({ refreshKey }: { refreshKey: number }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const res = await fetch("http://localhost:3001/sales");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, [refreshKey]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Cabeceras resaltadas en Sage Green #728d84 */}
            <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">Fecha</TableHead>
            <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4">Productos</TableHead>
            <TableHead className="bg-[#728d84] text-white font-bold px-6 py-4 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={3} className="text-center h-32"><Loader2 className="animate-spin inline mr-2 text-[#728d84]"/> Cargando historial...</TableCell></TableRow>
          ) : sales.length === 0 ? (
            <TableRow><TableCell colSpan={3} className="text-center h-32 text-slate-400 italic">No hay ventas registradas todavía.</TableCell></TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="px-6 font-medium text-slate-600">
                  {new Date(sale.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex flex-wrap gap-1">
                    {sale.items.map((item) => (
                      <Badge key={item.id} variant="secondary" className="bg-slate-100 text-slate-700 text-[10px]">
                        {item.quantity}x {item.product.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-6 text-right font-bold text-[#728d84]">
                  ${Number(sale.total).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}