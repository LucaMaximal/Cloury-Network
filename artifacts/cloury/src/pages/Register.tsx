import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import logoImg from "@assets/IMG_4954_1779645593363.png";

const schema = z.object({
  username: z.string().min(3, "Mindestens 3 Zeichen").max(20, "Maximal 20 Zeichen").regex(/^[a-zA-Z0-9_]+$/, "Nur Buchstaben, Zahlen und _"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await registerUser({ email: data.email, username: data.username, password: data.password });
    } catch {
      setServerError("Registrierung fehlgeschlagen. Benutzername oder E-Mail bereits vergeben.");
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 blur-[200px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 md:p-12 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <img src={logoImg} alt="Cloury" className="w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(168,85,255,0.5)]" />
            <h1 className="text-3xl font-display font-bold text-white mb-2">Account erstellen</h1>
            <p className="text-muted-foreground text-sm">Tritt dem Cloury Network bei.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Benutzername</label>
              <Input
                {...register("username")}
                placeholder="CoolUsername123"
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4"
                data-testid="input-username"
              />
              {errors.username && <p className="text-xs text-destructive ml-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">E-Mail Adresse</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="name@beispiel.de"
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4"
                data-testid="input-email"
              />
              {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Passwort</label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Mindestens 8 Zeichen"
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4"
                data-testid="input-password"
              />
              {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Passwort bestätigen</label>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Passwort wiederholen"
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4"
                data-testid="input-confirm-password"
              />
              {errors.confirmPassword && <p className="text-xs text-destructive ml-1">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">{serverError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-bold bg-accent text-accent-foreground hover:bg-accent/90 mt-6 shadow-[0_0_20px_rgba(168,85,255,0.3)]"
              data-testid="button-register"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" /> Erstellen...</span>
              ) : (
                <span className="flex items-center gap-2"><UserPlus size={18} /> Account erstellen</span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Bereits registriert?{" "}
            <Link href="/login" className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1">
              Zum Login <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
