import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Mail, 
  Clock, 
  Plus,
  Edit2,
  Trash2,
  Save,
  Eye,
  MousePointer,
  Send,
  AlertTriangle,
  TestTube,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface SequenceStep {
  id: string;
  step_order: number;
  subject: string;
  content: string;
  delay_hours: number;
  sends_count?: number;
  open_rate?: number;
  click_rate?: number;
}

interface SequenceDetailProps {
  sequenceId: string;
  onBack: () => void;
}

const SequenceDetail = ({ sequenceId, onBack }: SequenceDetailProps) => {
  const [sequence, setSequence] = useState<any>(null);
  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', content: '', delay_hours: 0 });
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepForm, setNewStepForm] = useState({ subject: '', content: '', delay_hours: 24 });
  const [testEmailModal, setTestEmailModal] = useState<{ open: boolean; step: SequenceStep | null }>({ open: false, step: null });
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSequenceDetails();
  }, [sequenceId]);

  const fetchSequenceDetails = async () => {
    try {
      // Fetch sequence
      const { data: seqData, error: seqError } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();

      if (seqError) throw seqError;
      setSequence(seqData);

      // Fetch steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('email_sequence_steps')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('step_order', { ascending: true });

      if (stepsError) throw stepsError;

      // Fetch send stats per step
      const { data: sendsData } = await supabase
        .from('email_sends')
        .select('step_id, status')
        .eq('sequence_id', sequenceId);

      // Fetch events
      const { data: sendIdsData } = await supabase
        .from('email_sends')
        .select('id, step_id')
        .eq('sequence_id', sequenceId);

      const { data: eventsData } = await supabase
        .from('email_events')
        .select('email_send_id, event_type');

      // Enrich steps with stats
      const enrichedSteps = stepsData?.map(step => {
        const stepSends = sendsData?.filter(s => s.step_id === step.id) || [];
        const deliveredSends = stepSends.filter(s => s.status === 'delivered').length;
        
        const stepSendIds = sendIdsData?.filter(s => s.step_id === step.id).map(s => s.id) || [];
        const stepEvents = eventsData?.filter(e => stepSendIds.includes(e.email_send_id)) || [];
        const opens = stepEvents.filter(e => e.event_type === 'open').length;
        const clicks = stepEvents.filter(e => e.event_type === 'click').length;

        return {
          ...step,
          sends_count: stepSends.length,
          open_rate: deliveredSends > 0 ? Math.round((opens / deliveredSends) * 100) : 0,
          click_rate: deliveredSends > 0 ? Math.round((clicks / deliveredSends) * 100) : 0,
        };
      }) || [];

      setSteps(enrichedSteps);
    } catch (error) {
      console.error('Error fetching sequence details:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la secuencia',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (step: SequenceStep) => {
    setEditingStep(step.id);
    setEditForm({
      subject: step.subject,
      content: step.content,
      delay_hours: step.delay_hours,
    });
  };

  const saveStep = async (stepId: string) => {
    try {
      const { error } = await supabase
        .from('email_sequence_steps')
        .update({
          subject: editForm.subject,
          content: editForm.content,
          delay_hours: editForm.delay_hours,
        })
        .eq('id', stepId);

      if (error) throw error;

      setSteps(prev => 
        prev.map(s => s.id === stepId ? { ...s, ...editForm } : s)
      );
      setEditingStep(null);

      toast({
        title: 'Paso actualizado',
        description: 'Los cambios se guardaron correctamente',
      });
    } catch (error) {
      console.error('Error saving step:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el paso',
        variant: 'destructive',
      });
    }
  };

  const addStep = async () => {
    if (!newStepForm.subject.trim() || !newStepForm.content.trim()) {
      toast({
        title: 'Error',
        description: 'El asunto y contenido son requeridos',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newOrder = steps.length > 0 ? Math.max(...steps.map(s => s.step_order)) + 1 : 1;
      
      const { data, error } = await supabase
        .from('email_sequence_steps')
        .insert({
          sequence_id: sequenceId,
          step_order: newOrder,
          subject: newStepForm.subject,
          content: newStepForm.content,
          delay_hours: newStepForm.delay_hours,
        })
        .select()
        .single();

      if (error) throw error;

      setSteps(prev => [...prev, { ...data, sends_count: 0, open_rate: 0, click_rate: 0 }]);
      setNewStepForm({ subject: '', content: '', delay_hours: 24 });
      setIsAddingStep(false);

      toast({
        title: 'Paso creado',
        description: 'El nuevo paso se agregó correctamente',
      });
    } catch (error) {
      console.error('Error adding step:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el paso',
        variant: 'destructive',
      });
    }
  };

  const deleteStep = async (stepId: string) => {
    try {
      const { error } = await supabase
        .from('email_sequence_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      setSteps(prev => prev.filter(s => s.id !== stepId));

      toast({
        title: 'Paso eliminado',
        description: 'El paso se eliminó correctamente',
      });
    } catch (error) {
      console.error('Error deleting step:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el paso',
        variant: 'destructive',
      });
    }
  };

  const formatDelay = (hours: number, stepOrder: number) => {
    if (hours === 0) return 'Inmediato';
    // Handle masterclass sequence with absolute timing (delay_hours = -1 means controlled by cron)
    if (hours < 0) {
      // Show meaningful labels based on step order for masterclass sequence
      if (stepOrder === 2) return '48-24h antes';
      if (stepOrder === 3) return '24-12h antes';
      if (stepOrder === 4) return '1-0h antes';
      return 'Automático';
    }
    if (hours < 24) return `${hours} horas después`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} día${days > 1 ? 's' : ''} después`;
    return `${days}d ${remainingHours}h después`;
  };

  const openTestEmailModal = (step: SequenceStep) => {
    setTestEmailModal({ open: true, step });
    setTestEmail('');
  };

  const sendTestEmail = async () => {
    if (!testEmailModal.step || !testEmail) return;

    setIsSendingTest(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: {
          to: testEmail,
          subject: testEmailModal.step.subject,
          content: testEmailModal.step.content,
        },
      });

      if (error) throw error;

      toast({
        title: '¡Email de prueba enviado!',
        description: `Se envió a ${testEmail}`,
      });
      setTestEmailModal({ open: false, step: null });
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar el email de prueba',
        variant: 'destructive',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Cargando secuencia...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{sequence?.name}</h2>
          {sequence?.description && (
            <p className="text-sm text-muted-foreground">{sequence.description}</p>
          )}
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddingStep(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Paso
        </Button>
      </div>

      {/* Add Step Form */}
      {isAddingStep && (
        <Card className="bg-card border-primary">
          <CardHeader>
            <CardTitle className="text-foreground">Nuevo Paso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Asunto del email</label>
              <Input
                value={newStepForm.subject}
                onChange={e => setNewStepForm({ ...newStepForm, subject: e.target.value })}
                placeholder="Ej: ¡Gracias por descargar nuestra guía!"
                className="bg-muted/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Contenido</label>
              <Textarea
                value={newStepForm.content}
                onChange={e => setNewStepForm({ ...newStepForm, content: e.target.value })}
                placeholder="Escribe el contenido del email..."
                className="bg-muted/50 min-h-[120px]"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Enviar después de (horas)</label>
              <Input
                type="number"
                value={newStepForm.delay_hours}
                onChange={e => setNewStepForm({ ...newStepForm, delay_hours: parseInt(e.target.value) || 0 })}
                className="bg-muted/50 w-32"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addStep}>
                <Plus className="h-4 w-4 mr-1" />
                Crear Paso
              </Button>
              <Button variant="ghost" onClick={() => setIsAddingStep(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps Timeline */}
      <div className="space-y-4">
        {steps.length === 0 && !isAddingStep ? (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="p-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sin pasos configurados
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Agrega el primer email de esta secuencia
              </p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddingStep(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Paso
              </Button>
            </CardContent>
          </Card>
        ) : (
          steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Timeline connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-[27px] top-[72px] w-0.5 h-[calc(100%-40px)] bg-border" />
              )}
              
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                        <span className="text-lg font-bold text-primary">{step.step_order}</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDelay(step.delay_hours, step.step_order)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {editingStep === step.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground">Asunto</label>
                            <Input
                              value={editForm.subject}
                              onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
                              className="bg-muted/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Contenido</label>
                            <Textarea
                              value={editForm.content}
                              onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                              className="bg-muted/50 min-h-[120px]"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Delay (horas)</label>
                            <Input
                              type="number"
                              value={editForm.delay_hours}
                              onChange={e => setEditForm({ ...editForm, delay_hours: parseInt(e.target.value) || 0 })}
                              className="bg-muted/50 w-32"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveStep(step.id)}>
                              <Save className="h-4 w-4 mr-1" />
                              Guardar
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingStep(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground text-lg">
                              {step.subject}
                            </h4>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-primary border-primary/50 hover:bg-primary/10"
                                onClick={() => openTestEmailModal(step)}
                              >
                                <TestTube className="h-4 w-4 mr-1" />
                                Enviar prueba
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => startEditing(step)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/80" onClick={() => deleteStep(step.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4 line-clamp-3">
                            {step.content}
                          </p>

                          {/* Step Stats */}
                          <div className="flex items-center gap-4 pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <Send className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {step.sends_count || 0} enviados
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-blue-400 font-medium">
                                {step.open_rate || 0}% aperturas
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MousePointer className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400 font-medium">
                                {step.click_rate || 0}% clicks
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Test Email Modal */}
      <Dialog open={testEmailModal.open} onOpenChange={(open) => setTestEmailModal({ open, step: open ? testEmailModal.step : null })}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Enviar Email de Prueba</DialogTitle>
            <DialogDescription>
              Se enviará una copia del email "{testEmailModal.step?.subject}" a la dirección que especifiques.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-muted-foreground mb-2 block">Email de destino</label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTestEmailModal({ open: false, step: null })}>
              Cancelar
            </Button>
            <Button 
              onClick={sendTestEmail} 
              disabled={!testEmail || isSendingTest}
              className="bg-primary hover:bg-primary/90"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Prueba
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SequenceDetail;
