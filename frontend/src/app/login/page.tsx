import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | AdminPanel",
  description: "Acceso al panel administrativo genérico.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
       <LoginForm />
    </main>
  );
}