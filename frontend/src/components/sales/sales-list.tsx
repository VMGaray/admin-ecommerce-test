"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";
import { Sale, SaleItem } from "@/types";

export function SalesList({ refreshKey }: { refreshKey: number }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/sales")
      .then((res) => res.json())
      .then((data: Sale[]) => {
        setSales(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error al cargar ventas:", err));
  }, [refreshKey]);

  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  });

  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-[#728d84]" size={32} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
      <Table className="min-w-150 md:min-w-full">
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-24">ID Venta</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead className="text-right">Total Cobrado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-32 text-slate-500 italic">
                No hay ventas registradas todavía en VG Store.
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-[10px] text-slate-400">
                  #{sale.id.split('-')[0]}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} className="text-[#728d84]" />
                    <span className="text-sm">{dateFormatter.format(new Date(sale.createdAt))}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {sale.items.map((item: SaleItem) => (
                      <Badge 
                        key={item.id} 
                        variant="secondary" 
                        className="font-medium bg-green-50 text-[#728d84] border-green-100"
                      >
                        {item.quantity}x {item.product.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  {currencyFormatter.format(sale.total)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}