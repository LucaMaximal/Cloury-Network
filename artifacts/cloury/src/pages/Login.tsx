import { Layout } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import logoImg from "@assets/IMG_4954_1779645593363.png";

const schema = z.object({
  login: z.string().min(1, "Pflichtfeld"),
  password: z.string().min(1, "Pflichtfeld"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await login({ login: data.login, password: data.password });
    } catch {
      setServerError("Ungültige Anmeldedaten. Bitte überprüfe deine Eingaben.");
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 md:p-12 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <img src={logoImg} alt="Cloury" className="w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
            <h1 className="text-3xl font-display font-bold text-white mb-2">Willkommen zurück</h1>
            <p className="text-muted-foreground text-sm">Melde dich an, um dein Profil zu verwalten.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Benutzername oder E-Mail</label>
              <Input
                {...register("login")}
                placeholder="name@beispiel.de"
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/50 px-4"
                data-testid="input-login"
              />
              {errors.login && <p className="text-xs text-destructive ml-1">{errors.login.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">Passwort</label>
              </div>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/50 px-4"
                data-testid="input-password"
              />
              {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">{serverError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-4 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" /> Anmelden...</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={18} /> Anmelden</span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Noch keinen Account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1">
              Jetzt registrieren <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
