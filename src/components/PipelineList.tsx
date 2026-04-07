import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
}

interface PipelineListProps {
  leads: Lead[];
  isLoading: boolean;
  onMoveStage: (leadId: string, newStage: string) => void;
  onCloseLead: (leadId: string, status: 'won' | 'lost') => void;
  onDeleteLead: (lead: Lead) => void;
}

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
}

const STAGES = [
  { id: 'new', label: 'Nuevo' },
  { id: 'in_progress', label: 'En Proceso' },
  { id: 'closed', label: 'Cerrado' },
];

const PipelineList = ({ leads, isLoading, onMoveStage, onCloseLead, onDeleteLead }: PipelineListProps) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'closed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStageLabel = (stage: string) => {
    return STAGES.find(s => s.id === stage)?.label || stage;
  };

  return (
    <div className="glass-card rounded-xl border border-primary/20 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Fecha</TableHead>
            <TableHead className="text-muted-foreground">Nombre</TableHead>
            <TableHead className="text-muted-foreground">Email</TableHead>
            <TableHead className="text-muted-foreground">Empresa</TableHead>
            <TableHead className="text-muted-foreground">Calidad</TableHead>
            <TableHead className="text-muted-foreground">Etapa</TableHead>
            <TableHead className="text-muted-foreground">Estado</TableHead>
            <TableHead className="text-muted-foreground">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No hay leads aún
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id} className="border-border">
                <TableCell className="text-foreground">
                  {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {lead.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="text-foreground">{lead.company}</TableCell>
                <TableCell>
                  <Badge 
                    className={lead.lead_quality === 'high' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                    }
                  >
                    {lead.lead_quality === 'high' ? 'Alta' : 'Baja'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.pipeline_stage}
                    onValueChange={(value) => onMoveStage(lead.id, value)}
                    disabled={lead.pipeline_stage === 'closed'}
                  >
                    <SelectTrigger className={`w-32 h-8 text-xs ${getStageColor(lead.pipeline_stage)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {STAGES.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {lead.close_status ? (
                    <Badge 
                      className={lead.close_status === 'won' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                      }
                    >
                      {lead.close_status === 'won' ? 'Ganado' : 'Perdido'}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {lead.pipeline_stage !== 'closed' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10"
                          onClick={() => onCloseLead(lead.id, 'won')}
                          title="Marcar como ganado"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10"
                          onClick={() => onCloseLead(lead.id, 'lost')}
                          title="Marcar como perdido"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteLead(lead)}
                      title="Eliminar lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PipelineList;