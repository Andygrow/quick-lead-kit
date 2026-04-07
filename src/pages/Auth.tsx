import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Mail, ArrowLeft, UserPlus } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/admin');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        toast({
          title: "Cuenta creada",
          description: "Revisa tu email para confirmar tu cuenta.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let message = "Hubo un error. Por favor, intenta de nuevo.";
      if (error.message.includes('Invalid login credentials')) {
        message = "Credenciales incorrectas. Verifica tu email y contraseña.";
      } else if (error.message.includes('already registered')) {
        message = "Este email ya está registrado. Intenta iniciar sesión.";
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="template-theme">
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Back link */}
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </a>

          {/* Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto">
                  {isRegister ? <UserPlus className="h-6 w-6 text-primary-foreground" /> : <Lock className="h-6 w-6 text-primary-foreground" />}
                </div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {isRegister ? 'Crear Cuenta' : 'Panel de Administración'}
                </h1>
                <p className="text-muted-foreground">
                  {isRegister ? 'Regístrate para acceder al panel' : 'Ingresa tus credenciales para acceder'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@empresa.com"
                      {...register('email')}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register('password')}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground font-semibold py-6 text-lg hover:bg-primary/90 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isRegister ? 'Creando cuenta...' : 'Iniciando sesión...'}
                    </>
                  ) : (
                    isRegister ? 'Crear cuenta' : 'Iniciar sesión'
                  )}
                </Button>
              </form>

              {/* Toggle login/register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </button>
              </div>

              {/* ⚠️ NOTA PARA PRODUCCIÓN */}
              {/* 📌 AL PUBLICAR: Eliminar la opción de registro abierto (setIsRegister y el botón toggle). 
                  Dejar solo login para que únicamente usuarios pre-creados puedan acceder al admin. */}
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <p className="text-[11px] text-amber-400/80 text-center font-medium">
                  ⚠️ <strong>DEMO:</strong> El registro abierto está activo para pruebas. 
                  Al publicar, eliminar esta función y dejar solo login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
