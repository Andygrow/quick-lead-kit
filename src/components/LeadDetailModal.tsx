import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Building, 
  User, 
  Calendar,
  Globe,
  Tag,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Phone,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
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
  quiz_score?: number | null;
  quiz_level?: string | null;
  quiz_answers?: Record<string, number> | null;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// CI+7 step names for display
const CI7_STEP_NAMES: Record<number, string> = {
  1: 'Objetivo',
  2: 'Perfil',
  3: 'Red',
  4: 'Networking',
  5: 'Contenido',
  6: 'Medición',
  7: 'Conversión',
};

const LeadDetailModal = ({ lead, open, onOpenChange }: LeadDetailModalProps) => {
  if (!lead) return null;

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case 'new':
        return { label: 'Nuevo', color: 'bg-primary/20 text-primary border-primary/30', icon: Clock };
      case 'in_progress':
        return { label: 'Masterclass', color: 'bg-amber-500/20 text-amber-600 border-amber-500/30', icon: TrendingUp };
      case 'qualified':
        return { label: 'Programa (Pendiente)', color: 'bg-purple-500/20 text-purple-600 border-purple-500/30', icon: Clock };
      case 'closed':
        return { label: 'Programa (Pagado)', color: 'bg-green-500/20 text-green-600 border-green-500/30', icon: CheckCircle2 };
      default:
        return { label: stage, color: 'bg-muted text-muted-foreground', icon: Clock };
    }
  };

  const getQuizLevelInfo = (level: string | null | undefined) => {
    if (!level) return null;
    
    switch (level) {
      case 'beginner':
        return { label: 'Nivel Inicial', color: 'bg-accent text-accent-foreground', description: 'Gran potencial de mejora' };
      case 'intermediate':
        return { label: 'Nivel Intermedio', color: 'bg-amber-500 text-white', description: 'Buen progreso' };
      case 'advanced':
        return { label: 'Nivel Avanzado', color: 'bg-green-500 text-white', description: 'Estrategia sólida' };
      default:
        return null;
    }
  };

  const stageInfo = getStageInfo(lead.pipeline_stage);
  const StageIcon = stageInfo.icon;
  const quizLevelInfo = getQuizLevelInfo(lead.quiz_level);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
        <DialogHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
              <User className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg md:text-xl font-bold text-foreground mb-1 truncate">
                {lead.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{lead.company}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`${stageInfo.color} border px-2 md:px-3 py-1 text-xs`}>
              <StageIcon className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
              {stageInfo.label}
            </Badge>
            <Badge 
              className={`border px-2 md:px-3 py-1 text-xs ${lead.lead_quality === 'high' 
                ? 'bg-green-500/20 text-green-600 border-green-500/30' 
                : 'bg-amber-500/20 text-amber-600 border-amber-500/30'
              }`}
            >
              {lead.lead_quality === 'high' ? '★ Alta Calidad' : 'Calidad Baja'}
            </Badge>
            {lead.close_status && (
              <Badge 
                className={`px-2 md:px-3 py-1 text-xs ${lead.close_status === 'won' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
                }`}
              >
                {lead.close_status === 'won' ? '✓ Ganado' : '✗ Perdido'}
              </Badge>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Two Column Layout for larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Información de Contacto
              </h4>
              
              <div className="grid gap-2 bg-muted/50 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-xs md:text-sm text-primary hover:underline font-medium truncate block">
                      {lead.email}
                    </a>
                  </div>
                  {lead.is_corporate_email && (
                    <Badge variant="outline" className="text-[9px] md:text-[10px] border-primary/30 text-primary flex-shrink-0">Corp</Badge>
                  )}
                </div>
                
                {lead.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Teléfono</p>
                      <a href={`tel:${lead.phone}`} className="text-xs md:text-sm text-foreground font-medium hover:text-primary truncate block">
                        {lead.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Perfil</p>
                    <p className="text-xs md:text-sm text-foreground font-medium truncate">{lead.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Fecha de registro</p>
                    <p className="text-xs md:text-sm text-foreground">
                      {format(new Date(lead.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Quiz Results - Visual Progress Bars */}
          {(lead.quiz_score || lead.quiz_level || lead.quiz_answers) && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5" />
                Diagnóstico CI+7
              </h4>
              
              <div className="rounded-lg border border-border overflow-hidden h-fit">
                {/* Header with level and score */}
                {quizLevelInfo && (
                  <div className={`px-3 py-2.5 flex items-center justify-between ${quizLevelInfo.color}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        {lead.quiz_level === 'beginner' && <span className="text-sm">🌱</span>}
                        {lead.quiz_level === 'intermediate' && <span className="text-sm">📈</span>}
                        {lead.quiz_level === 'advanced' && <span className="text-sm">🏆</span>}
                      </div>
                      <span className="font-bold text-sm">{quizLevelInfo.label}</span>
                    </div>
                    {lead.quiz_score && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold">{lead.quiz_score}</span>
                        <span className="text-xs opacity-80">/35 pts</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Visual progress bars for each step */}
                <div className="p-3 bg-muted/30 space-y-2">
                  {lead.quiz_answers && Object.entries(lead.quiz_answers).map(([stepId, score]) => {
                    const percentage = (Number(score) / 5) * 100;
                    const isStrong = Number(score) >= 4;
                    const isWeak = Number(score) <= 2;
                    
                    return (
                      <div key={stepId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground font-medium flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {stepId}
                            </span>
                            {CI7_STEP_NAMES[parseInt(stepId)] || `Paso ${stepId}`}
                          </span>
                          <span className={`font-semibold ${
                            isStrong ? 'text-green-600' : 
                            isWeak ? 'text-accent' : 
                            'text-amber-600'
                          }`}>
                            {score}/5
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isStrong ? 'bg-green-500' : 
                              isWeak ? 'bg-accent' : 
                              'bg-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 pt-2 mt-2 border-t border-border">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Fortaleza (4-5)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>En desarrollo (3)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>A mejorar (1-2)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Notes */}
          {lead.notes && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Notas
                </h4>
                <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3 border border-border">
                  {lead.notes}
                </p>
              </div>
            </>
          )}

          {/* UTM Info */}
          {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  Origen de la Campaña
                </h4>
                
                <div className="flex flex-wrap gap-1.5">
                  {lead.utm_source && (
                    <Badge variant="outline" className="text-[10px] border-border text-foreground">
                      <Tag className="h-2.5 w-2.5 mr-1" />
                      {lead.utm_source}
                    </Badge>
                  )}
                  {lead.utm_medium && (
                    <Badge variant="outline" className="text-[10px] border-border text-foreground">
                      {lead.utm_medium}
                    </Badge>
                  )}
                  {lead.utm_campaign && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      {lead.utm_campaign}
                    </Badge>
                  )}
                  {lead.utm_term && (
                    <Badge variant="outline" className="text-[10px] border-border text-foreground">
                      {lead.utm_term}
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Closed Info */}
          {lead.closed_at && (
            <>
              <Separator className="bg-border" />
              <div className={`flex items-center gap-3 p-2 md:p-3 rounded-lg ${
                lead.close_status === 'won' 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {lead.close_status === 'won' ? (
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs md:text-sm font-medium ${
                    lead.close_status === 'won' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lead.close_status === 'won' ? 'Lead Ganado' : 'Lead Perdido'}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {format(new Date(lead.closed_at), "dd MMM yyyy, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;