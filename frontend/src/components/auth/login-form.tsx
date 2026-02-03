"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        // Seteamos la cookie para el middleware
        document.cookie = `auth_token=${user.token}; path=/; max-age=86400`; // 24hs
        router.push("/");
        router.refresh(); // Para que el middleware re-valide la ruta
      } else {
        alert("Credenciales incorrectas. Verificá los datos en Supabase.");
      }
    } catch (err) {
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[400px] shadow-xl border-slate-200">
      <CardHeader className="text-center">
        <div className="mx-auto bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
          <Lock size={24} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Bienvenido</CardTitle>
        <CardDescription>Ingresá al Panel Administrativo de AdminShop</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email text-slate-700">Email Corporativo</Label>
            <Input id="email" name="email" type="email" placeholder="admin@admin.com" required className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password text-slate-700">Contraseña</Label>
            <Input id="password" name="password" type="password" required className="bg-slate-50" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all font-semibold" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Iniciar Sesión"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}