import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Building,
  Clock,
  Eye,
  Trash2,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LeadDetailModal from './LeadDetailModal';

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
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  is_corporate_email?: boolean;
  phone?: string | null;
  source_table?: 'leads' | 'webinar' | 'program';
  linkedin_profile?: string | null;
  course_objective?: string | null;
  payment_status?: string | null;
  quiz_score?: number | null;
  quiz_level?: string | null;
  quiz_answers?: Record<string, number> | null;
}

interface PipelineKanbanProps {
  leads: Lead[];
  onMoveStage: (leadId: string, newStage: string) => void;
  onCloseLead: (leadId: string, status: 'won' | 'lost') => void;
  onDeleteLead: (lead: Lead) => void;
}

const STAGES = [
  { id: 'new', label: 'Lead Magnet', color: 'bg-blue-500', icon: Clock },
  { id: 'in_progress', label: 'Masterclass', color: 'bg-yellow-500', icon: Mail },
  { id: 'qualified', label: 'Programa (Pendiente)', color: 'bg-purple-500', icon: Clock },
  { id: 'closed', label: 'Programa (Pagado)', color: 'bg-green-500', icon: CheckCircle2 },
];

const PipelineKanban = ({ leads, onMoveStage, onCloseLead, onDeleteLead }: PipelineKanbanProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const leadsByStage = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage.id] = leads.filter(lead => lead.pipeline_stage === stage.id);
      return acc;
    }, {} as Record<string, Lead[]>);
  }, [leads]);

  const getNextStage = (currentStage: string): string | null => {
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    if (currentIndex < STAGES.length - 1) {
      return STAGES[currentIndex + 1].id;
    }
    return null;
  };

  const handleCardClick = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map(stage => {
          const StageIcon = stage.icon;
          const stageLeads = leadsByStage[stage.id] || [];
          
          return (
            <div key={stage.id} className="flex flex-col">
              <div className={`${stage.color} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <StageIcon className="h-5 w-5 text-white" />
                  <span className="font-semibold text-white">{stage.label}</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {stageLeads.length}
                </Badge>
              </div>
              
              <div className="flex-1 bg-card rounded-b-xl p-3 min-h-[400px] space-y-3 border border-t-0 border-border rounded-t-none">
                {stageLeads.map(lead => (
                  <Card 
                    key={lead.id} 
                    className="bg-muted border border-border cursor-pointer transition-all hover:border-primary hover:shadow-md hover:shadow-primary/10"
                    onClick={() => handleCardClick(lead)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {lead.name}
                          </h4>
                          {lead.company && lead.company !== 'Por definir' && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {lead.company}
                            </p>
                          )}
                          {lead.phone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </p>
                          )}
                        </div>
                        <Badge 
                          className={
                            lead.lead_quality === 'high' 
                              ? 'bg-primary/20 text-primary' 
                              : lead.lead_quality === 'medium'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-blue-500/20 text-blue-400'
                          }
                        >
                          {lead.lead_quality === 'high' ? 'Alta' : lead.lead_quality === 'medium' ? 'Media' : 'Lead'}
                        </Badge>
                      </div>
                      
                      <a 
                        href={`mailto:${lead.email}`}
                        className="text-xs text-primary hover:underline truncate block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.email}
                      </a>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: es })}
                        </p>
                        {lead.pipeline_stage === 'closed' && (
                          <Badge className="bg-primary/20 text-primary text-[10px]">
                            ✓ Pagado
                          </Badge>
                        )}
                        {lead.pipeline_stage === 'qualified' && (
                          <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">
                            Pendiente
                          </Badge>
                        )}
                        {lead.quiz_level && (
                          <Badge 
                            className={
                              lead.quiz_level === 'beginner' 
                                ? 'bg-accent/20 text-accent text-[10px]' 
                                : lead.quiz_level === 'intermediate'
                                  ? 'bg-amber-500/20 text-amber-400 text-[10px]'
                                  : 'bg-primary/20 text-primary text-[10px]'
                            }
                          >
                            {lead.quiz_level === 'beginner' ? 'Inicial' : lead.quiz_level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                          </Badge>
                        )}
                      </div>

                      {lead.pipeline_stage === 'closed' && lead.close_status && (
                        <Badge 
                          className={lead.close_status === 'won' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-destructive text-destructive-foreground'
                          }
                        >
                          {lead.close_status === 'won' ? '✓ Ganado' : '✗ Perdido'}
                        </Badge>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-muted-foreground hover:text-primary h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(lead);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLead(lead);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        {/* Advance button */}
                        {stage.id !== 'closed' && getNextStage(stage.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 px-2 border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveStage(lead.id, getNextStage(stage.id)!);
                            }}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {stage.id === 'qualified' ? 'Marcar Pagado' : 'Avanzar'}
                          </Button>
                        )}
                        
                        {/* Mark as lost button */}
                        {stage.id === 'qualified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30 h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCloseLead(lead.id, 'lost');
                            }}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Sin leads en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeadDetailModal 
        lead={selectedLead}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default PipelineKanban;