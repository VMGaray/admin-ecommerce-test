"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Store, ShieldCheck } from "lucide-react";

export function SettingsForm() {
  const focusClasses = "focus-visible:ring-[#728d84] focus:ring-[#728d84]";

  return (
    <Tabs defaultValue="tienda" className="space-y-4">
      <TabsList className="bg-slate-100 p-1">
        <TabsTrigger value="tienda" className="gap-2"><Store size={16} /> Tienda</TabsTrigger>
        <TabsTrigger value="perfil" className="gap-2"><User size={16} /> Perfil</TabsTrigger>
        <TabsTrigger value="seguridad" className="gap-2"><ShieldCheck size={16} /> Seguridad</TabsTrigger>
      </TabsList>

      {/* TAB TIENDA */}
      <TabsContent value="tienda">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Información del Negocio</CardTitle>
            <CardDescription>Datos globales de VG Store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de la Tienda</Label>
                <Input defaultValue="VG Store" className={focusClasses} />
              </div>
              <div className="space-y-2">
                <Label>IVA (%)</Label>
                <Input type="number" defaultValue="21" className={focusClasses} />
              </div>
            </div>
            <Button className="bg-[#728d84] hover:bg-[#617971] text-white font-bold">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB PERFIL */}
      <TabsContent value="perfil">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tu Perfil</CardTitle>
            <CardDescription>Victoria, acá podés editar tus datos de administradora.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-[#728d84] flex items-center justify-center text-white text-xl font-bold">
                VG
              </div>
              <Button variant="outline" size="sm">Cambiar Foto</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input defaultValue="Victoria Garay" className={focusClasses} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="v.garay@example.com" className={focusClasses} />
              </div>
            </div>
            <Button className="bg-[#728d84] hover:bg-[#617971] text-white font-bold">
              Actualizar Perfil
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* TAB SEGURIDAD */}
      <TabsContent value="seguridad">
        <Card className="border-red-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Seguridad</CardTitle>
            <CardDescription>Configuraciones críticas de acceso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="font-bold">
              Cerrar todas las sesiones
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}