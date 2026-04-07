import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Eye, EyeOff, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const [resendApiKey, setResendApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'resend_api_key')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setResendApiKey(data.value);
        setHasApiKey(true);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!resendApiKey.trim()) {
      toast({
        title: "Error",
        description: "La API Key no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'resend_api_key')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update({ value: resendApiKey })
          .eq('key', 'resend_api_key');

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({ key: 'resend_api_key', value: resendApiKey });

        if (error) throw error;
      }

      setHasApiKey(true);
      toast({
        title: "Guardado",
        description: "La API Key de Resend se guardó correctamente",
      });
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la API Key",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="gradient-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Configuración de Email</CardTitle>
        </div>
        <CardDescription>
          Configura tu API Key de Resend para enviar emails automáticos y alertas de leads de alta calidad.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resend-api-key" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Resend API Key
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="resend-api-key"
                type={showApiKey ? 'text' : 'password'}
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                placeholder="re_xxxxxxxxxx..."
                className="pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button onClick={saveApiKey} disabled={isSaving || isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {hasApiKey ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-500">API Key configurada - Los emails están activos</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-500">Sin API Key - Los emails están desactivados</span>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Obtén tu API Key en{' '}
          <a 
            href="https://resend.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            resend.com/api-keys
          </a>
          . Recuerda verificar tu dominio en{' '}
          <a 
            href="https://resend.com/domains" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            resend.com/domains
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;