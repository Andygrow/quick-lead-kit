import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Mail, 
  Plus, 
  Play, 
  Pause, 
  ChevronRight,
  Clock,
  MousePointer,
  Eye,
  AlertTriangle,
  BarChart3,
  Settings,
  Zap,
  Loader2
} from 'lucide-react';
import SequenceDetail from './SequenceDetail';
import EmailAnalytics from './EmailAnalytics';

interface EmailSequence {
  id: string;
  name: string;
  description: string | null;
  trigger_event: string;
  is_active: boolean;
  created_at: string;
  steps_count?: number;
  sends_count?: number;
  open_rate?: number;
  click_rate?: number;
}

const EmailSequences = () => {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sequences');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSequence, setNewSequence] = useState({
    name: '',
    description: '',
    trigger_event: 'lead_created',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      // Fetch sequences with aggregated stats
      const { data: seqData, error: seqError } = await supabase
        .from('email_sequences')
        .select('*')
        .order('created_at', { ascending: false });

      if (seqError) throw seqError;

      // Fetch step counts
      const { data: stepsData } = await supabase
        .from('email_sequence_steps')
        .select('sequence_id');

      // Fetch send stats
      const { data: sendsData } = await supabase
        .from('email_sends')
        .select('sequence_id, status');

      // Fetch event stats
      const { data: eventsData } = await supabase
        .from('email_events')
        .select('email_send_id, event_type');

      // Get email_send_ids for mapping events
      const { data: sendIdsData } = await supabase
        .from('email_sends')
        .select('id, sequence_id');

      const sendIdToSequence = new Map(
        sendIdsData?.map(s => [s.id, s.sequence_id]) || []
      );

      // Calculate stats per sequence
      const enrichedSequences = seqData?.map(seq => {
        const stepsCount = stepsData?.filter(s => s.sequence_id === seq.id).length || 0;
        const seqSends = sendsData?.filter(s => s.sequence_id === seq.id) || [];
        const deliveredSends = seqSends.filter(s => s.status === 'delivered').length;
        
        // Count events for this sequence
        const seqSendIds = sendIdsData?.filter(s => s.sequence_id === seq.id).map(s => s.id) || [];
        const seqEvents = eventsData?.filter(e => seqSendIds.includes(e.email_send_id)) || [];
        const opens = seqEvents.filter(e => e.event_type === 'open').length;
        const clicks = seqEvents.filter(e => e.event_type === 'click').length;

        return {
          ...seq,
          steps_count: stepsCount,
          sends_count: seqSends.length,
          open_rate: deliveredSends > 0 ? Math.round((opens / deliveredSends) * 100) : 0,
          click_rate: deliveredSends > 0 ? Math.round((clicks / deliveredSends) * 100) : 0,
        };
      }) || [];

      setSequences(enrichedSequences);
    } catch (error) {
      console.error('Error fetching sequences:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las secuencias',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSequenceActive = async (sequenceId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .update({ is_active: !currentState })
        .eq('id', sequenceId);

      if (error) throw error;

      setSequences(prev => 
        prev.map(s => s.id === sequenceId ? { ...s, is_active: !currentState } : s)
      );

      toast({
        title: currentState ? 'Secuencia pausada' : 'Secuencia activada',
        description: currentState 
          ? 'Los nuevos leads no recibirán esta secuencia'
          : 'Los nuevos leads recibirán esta secuencia',
      });
    } catch (error) {
      console.error('Error toggling sequence:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la secuencia',
        variant: 'destructive',
      });
    }
  };

  const handleCreateSequence = async () => {
    if (!newSequence.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la secuencia es requerido',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .insert({
          name: newSequence.name.trim(),
          description: newSequence.description.trim() || null,
          trigger_event: newSequence.trigger_event,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Secuencia creada',
        description: 'Ahora puedes agregar pasos a la secuencia',
      });

      setShowCreateDialog(false);
      setNewSequence({ name: '', description: '', trigger_event: 'lead_created' });
      
      // Navigate to the new sequence
      if (data) {
        setSelectedSequence(data.id);
      }
      
      fetchSequences();
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la secuencia',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'quiz_completed': return 'Quiz completado';
      case 'lead_created': return 'Lead creado';
      case 'manual': return 'Manual';
      default: return trigger;
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'quiz_completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'lead_created': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'manual': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (selectedSequence) {
    return (
      <SequenceDetail 
        sequenceId={selectedSequence} 
        onBack={() => {
          setSelectedSequence(null);
          fetchSequences();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Secuencias de Email
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configura y mide tus campañas de email automatizadas
          </p>
        </div>
        <Button 
          className="gradient-cta shadow-cta hover:shadow-cta-hover transition-all"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Secuencia
        </Button>
      </div>

      {/* Create Sequence Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="glass-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Nueva Secuencia de Email
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="seq-name" className="text-foreground">Nombre</Label>
              <Input
                id="seq-name"
                placeholder="Ej: Bienvenida nuevos leads"
                value={newSequence.name}
                onChange={(e) => setNewSequence(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seq-desc" className="text-foreground">Descripción (opcional)</Label>
              <Textarea
                id="seq-desc"
                placeholder="Describe el objetivo de esta secuencia..."
                value={newSequence.description}
                onChange={(e) => setNewSequence(prev => ({ ...prev, description: e.target.value }))}
                className="bg-input border-border resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seq-trigger" className="text-foreground">Disparador</Label>
              <Select
                value={newSequence.trigger_event}
                onValueChange={(value) => setNewSequence(prev => ({ ...prev, trigger_event: value }))}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecciona un disparador" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="lead_created">Lead creado</SelectItem>
                  <SelectItem value="quiz_completed">Quiz completado</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Define cuándo se activará esta secuencia automáticamente
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateSequence}
              disabled={isCreating || !newSequence.name.trim()}
              className="gradient-cta shadow-cta hover:shadow-cta-hover"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Secuencia
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="sequences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Secuencias
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="mt-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{sequences.length}</p>
                    <p className="text-xs text-muted-foreground">Secuencias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Play className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {sequences.filter(s => s.is_active).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {sequences.length > 0 
                        ? Math.round(sequences.reduce((a, s) => a + (s.open_rate || 0), 0) / sequences.length)
                        : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Tasa Apertura</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <MousePointer className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {sequences.length > 0 
                        ? Math.round(sequences.reduce((a, s) => a + (s.click_rate || 0), 0) / sequences.length)
                        : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Tasa Clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sequences List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando secuencias...
              </div>
            ) : sequences.length === 0 ? (
              <Card className="bg-card border-border border-dashed">
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay secuencias configuradas
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crea tu primera secuencia de email para automatizar el seguimiento de leads
                  </p>
                  <Button 
                    className="gradient-cta shadow-cta hover:shadow-cta-hover"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Secuencia
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sequences.map(sequence => (
                <Card 
                  key={sequence.id} 
                  className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setSelectedSequence(sequence.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {sequence.name}
                          </h3>
                          <Badge className={getTriggerColor(sequence.trigger_event)}>
                            <Zap className="h-3 w-3 mr-1" />
                            {getTriggerLabel(sequence.trigger_event)}
                          </Badge>
                          {sequence.is_active ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Play className="h-3 w-3 mr-1" />
                              Activa
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              <Pause className="h-3 w-3 mr-1" />
                              Pausada
                            </Badge>
                          )}
                        </div>
                        {sequence.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {sequence.description}
                          </p>
                        )}
                        
                        {/* Stats Row */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {sequence.steps_count || 0} pasos
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {sequence.sends_count || 0} enviados
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 font-medium">
                              {sequence.open_rate || 0}% aperturas
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MousePointer className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">
                              {sequence.click_rate || 0}% clicks
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                        <Switch 
                          checked={sequence.is_active}
                          onCheckedChange={() => toggleSequenceActive(sequence.id, sequence.is_active)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <EmailAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSequences;
