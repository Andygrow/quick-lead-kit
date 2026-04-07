import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, EyeOff, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';

const GTMSettings = () => {
  const [gtmId, setGtmId] = useState('');
  const [showId, setShowId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGtmId, setHasGtmId] = useState(false);
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
        .eq('key', 'gtm_id')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setGtmId(data.value);
        setHasGtmId(true);
      }
    } catch (error: any) {
      console.error('Error fetching GTM settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGtmId = async () => {
    const trimmedId = gtmId.trim();
    
    if (!trimmedId) {
      toast({
        title: "Error",
        description: "El ID de GTM no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    // Validate GTM ID format (GTM-XXXXXXX)
    if (!trimmedId.match(/^GTM-[A-Z0-9]+$/i)) {
      toast({
        title: "Formato inválido",
        description: "El ID debe tener el formato GTM-XXXXXXX",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'gtm_id')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update({ value: trimmedId.toUpperCase() })
          .eq('key', 'gtm_id');

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({ key: 'gtm_id', value: trimmedId.toUpperCase() });

        if (error) throw error;
      }

      setGtmId(trimmedId.toUpperCase());
      setHasGtmId(true);
      toast({
        title: "Guardado",
        description: "El ID de Google Tag Manager se guardó correctamente. Recarga la página para ver los cambios.",
      });
    } catch (error: any) {
      console.error('Error saving GTM ID:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el ID de GTM",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeGtmId = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .delete()
        .eq('key', 'gtm_id');

      if (error) throw error;

      setGtmId('');
      setHasGtmId(false);
      toast({
        title: "Eliminado",
        description: "Google Tag Manager ha sido desactivado. Recarga la página para ver los cambios.",
      });
    } catch (error: any) {
      console.error('Error removing GTM ID:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el ID de GTM",
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
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Google Tag Manager</CardTitle>
        </div>
        <CardDescription>
          Conecta Google Tag Manager para medir eventos, conversiones y comportamiento de usuarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gtm-id" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            GTM Container ID
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="gtm-id"
                type={showId ? 'text' : 'password'}
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value.toUpperCase())}
                placeholder="GTM-XXXXXXX"
                className="pr-10 uppercase"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowId(!showId)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button onClick={saveGtmId} disabled={isSaving || isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
            {hasGtmId && (
              <Button variant="destructive" onClick={removeGtmId} disabled={isSaving || isLoading}>
                Desactivar
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {hasGtmId ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-500">GTM configurado - El tracking está activo</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-500">Sin GTM - El tracking está desactivado</span>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Obtén tu Container ID en{' '}
          <a 
            href="https://tagmanager.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Tag Manager
          </a>
          . El ID tiene el formato GTM-XXXXXXX y lo encuentras en la esquina superior derecha de tu contenedor.
        </p>
      </CardContent>
    </Card>
  );
};

export default GTMSettings;
