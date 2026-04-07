import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PipelineKanban from './PipelineKanban';
import PipelineList from './PipelineList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string;
  role: string;
  lead_quality: string;
  pipeline_stage: string;
  close_status: string | null;
  closed_at: string | null;
  notes: string | null;
  phone?: string | null;
  source_table?: 'leads' | 'webinar' | 'program';
  linkedin_profile?: string | null;
  course_objective?: string | null;
  payment_status?: string | null;
  quiz_score?: number | null;
  quiz_level?: string | null;
  quiz_answers?: Record<string, number> | null;
}

interface SalesPipelineProps {
  leads: Lead[];
  isLoading: boolean;
  onLeadsUpdate: () => void;
}

const SalesPipeline = ({ leads, isLoading, onLeadsUpdate }: SalesPipelineProps) => {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleMoveStage = async (leadId: string, newStage: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      const updateData: any = { pipeline_stage: newStage };
      
      if (newStage === 'closed') {
        updateData.closed_at = new Date().toISOString();
        updateData.close_status = 'won';
        
        // Send welcome email when marked as paid
        try {
          await supabase.functions.invoke('send-program-welcome', {
            body: { 
              name: lead.name, 
              email: lead.email,
              programName: 'LinkedIn 2026: Impacta con tu marca y estrategia'
            }
          });
          toast({
            title: "📧 Email enviado",
            description: `Se envió el email de bienvenida a ${lead.email}`,
          });
        } catch (emailError) {
          console.log('Email de bienvenida omitido:', emailError);
        }
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId);

      if (error) throw error;

      const stageLabels: Record<string, string> = {
        'new': 'Lead Magnet',
        'in_progress': 'Masterclass',
        'qualified': 'Programa (Pendiente)',
        'closed': 'Programa (Pagado)'
      };

      toast({
        title: "Actualizado",
        description: `Etapa cambiada a ${stageLabels[newStage] || newStage}`,
      });

      onLeadsUpdate();
    } catch (error: any) {
      console.error('Error updating lead stage:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el lead",
        variant: "destructive",
      });
    }
  };

  const handleCloseLead = async (leadId: string, status: 'won' | 'lost') => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          pipeline_stage: 'closed',
          close_status: status,
          closed_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: status === 'won' ? "🎉 ¡Lead ganado!" : "Lead cerrado",
        description: status === 'won' 
          ? "El lead ha sido marcado como ganado" 
          : "El lead ha sido marcado como perdido",
      });

      onLeadsUpdate();
    } catch (error: any) {
      console.error('Error closing lead:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar el lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadToDelete.id);

      if (error) throw error;

      toast({
        title: "Registro eliminado",
        description: `Se eliminó ${leadToDelete.name}`,
      });

      setLeadToDelete(null);
      setDeleteDialogOpen(false);
      onLeadsUpdate();
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  // Stats for pipeline
  const stats = {
    total: leads.length,
    leadMagnet: leads.filter(l => l.pipeline_stage === 'new').length,
    masterclass: leads.filter(l => l.pipeline_stage === 'in_progress').length,
    programPending: leads.filter(l => l.pipeline_stage === 'qualified').length,
    programPaid: leads.filter(l => l.pipeline_stage === 'closed').length,
  };

  const conversionRate = stats.total > 0 
    ? Math.round((stats.programPaid / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">{stats.leadMagnet}</p>
          <p className="text-xs text-muted-foreground">Lead Magnet</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-amber-500">{stats.masterclass}</p>
          <p className="text-xs text-muted-foreground">Masterclass</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.programPending}</p>
          <p className="text-xs text-muted-foreground">Pendiente Pago</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">{stats.programPaid}</p>
          <p className="text-xs text-muted-foreground">Pagados ({conversionRate}%)</p>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'list')}>
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="kanban" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4">
          <PipelineKanban 
            leads={leads} 
            onMoveStage={handleMoveStage}
            onCloseLead={handleCloseLead}
            onDeleteLead={openDeleteDialog}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <PipelineList 
            leads={leads}
            isLoading={isLoading}
            onMoveStage={handleMoveStage}
            onCloseLead={handleCloseLead}
            onDeleteLead={openDeleteDialog}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Eliminar oportunidad?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción eliminará permanentemente la oportunidad de{' '}
              <span className="font-semibold text-foreground">{leadToDelete?.name}</span>{' '}
              ({leadToDelete?.company}). No podrá recuperarse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLead}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalesPipeline;