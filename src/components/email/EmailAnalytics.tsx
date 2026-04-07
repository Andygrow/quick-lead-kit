import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Eye, 
  MousePointer, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EmailSend {
  id: string;
  lead_id: string;
  status: string;
  sent_at: string | null;
  lead?: {
    name: string;
    email: string;
  };
  sequence?: {
    name: string;
  };
  events_count?: number;
}

const EmailAnalytics = () => {
  const [sends, setSends] = useState<EmailSend[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    bounced: 0,
    pending: 0,
    opens: 0,
    clicks: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all sends
      const { data: sendsData } = await supabase
        .from('email_sends')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all events
      const { data: eventsData } = await supabase
        .from('email_events')
        .select('*')
        .order('occurred_at', { ascending: false });

      // Fetch leads for recent activity
      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, name, email');

      // Calculate stats
      const total = sendsData?.length || 0;
      const delivered = sendsData?.filter(s => s.status === 'delivered').length || 0;
      const bounced = sendsData?.filter(s => s.status === 'bounced').length || 0;
      const pending = sendsData?.filter(s => s.status === 'pending').length || 0;
      const opens = eventsData?.filter(e => e.event_type === 'open').length || 0;
      const clicks = eventsData?.filter(e => e.event_type === 'click').length || 0;

      setStats({ total, delivered, bounced, pending, opens, clicks });
      setSends(sendsData || []);

      // Build recent activity
      const activity = eventsData?.slice(0, 10).map(event => {
        const send = sendsData?.find(s => s.id === event.email_send_id);
        const lead = leadsData?.find(l => l.id === send?.lead_id);
        return {
          ...event,
          lead_name: lead?.name || 'Desconocido',
          lead_email: lead?.email || '',
        };
      }) || [];

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openRate = stats.delivered > 0 ? Math.round((stats.opens / stats.delivered) * 100) : 0;
  const clickRate = stats.delivered > 0 ? Math.round((stats.clicks / stats.delivered) * 100) : 0;
  const bounceRate = stats.total > 0 ? Math.round((stats.bounced / stats.total) * 100) : 0;

  const chartConfig = {
    delivered: { label: 'Entregados', color: '#22c55e' },
    bounced: { label: 'Rebotados', color: '#ef4444' },
    pending: { label: 'Pendientes', color: 'hsl(var(--primary))' },
  };

  const statusData = [
    { name: 'Entregados', value: stats.delivered, color: '#22c55e' },
    { name: 'Rebotados', value: stats.bounced, color: '#ef4444' },
    { name: 'Pendientes', value: stats.pending, color: 'hsl(var(--primary))' },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'open': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'click': return <MousePointer className="h-4 w-4 text-yellow-400" />;
      case 'bounce': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Mail className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'open': return 'Abrió email';
      case 'click': return 'Hizo click';
      case 'bounce': return 'Rebotó';
      default: return type;
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Cargando métricas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-card rounded-xl p-4 border border-primary/20 text-center">
          <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Enviados</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-green-500/30 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
          <p className="text-xs text-muted-foreground">Entregados</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-blue-500/30 text-center">
          <Eye className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{openRate}%</p>
          <p className="text-xs text-muted-foreground">Tasa Apertura</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-yellow-500/30 text-center">
          <MousePointer className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{clickRate}%</p>
          <p className="text-xs text-muted-foreground">Tasa Clicks</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-red-500/30 text-center">
          <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{bounceRate}%</p>
          <p className="text-xs text-muted-foreground">Tasa Rebote</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-purple-500/30 text-center">
          <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.clicks}</p>
          <p className="text-xs text-muted-foreground">Total Clicks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-card rounded-xl p-6 border border-primary/20">
          <h3 className="font-display font-semibold text-foreground text-lg mb-4">Distribución de Estado</h3>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium text-foreground">
                          {payload[0].name}: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6 border border-primary/20">
          <h3 className="font-display font-semibold text-foreground text-lg mb-4">Actividad Reciente</h3>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Sin actividad reciente
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {recentActivity.map((event, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-primary/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {getEventIcon(event.event_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {event.lead_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getEventLabel(event.event_type)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.occurred_at), 'HH:mm', { locale: es })}
                    </span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Lead Engagement Score Explanation */}
      <div className="glass-card rounded-xl p-6 border border-primary/20">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mejora de Calificación de Leads
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Los leads mejoran su calificación automáticamente basándose en su interacción con los emails:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Eye className="h-6 w-6 text-blue-400 mb-2" />
            <h4 className="font-medium text-foreground">Apertura de Email</h4>
            <p className="text-xs text-muted-foreground">+5 puntos de engagement</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <MousePointer className="h-6 w-6 text-yellow-400 mb-2" />
            <h4 className="font-medium text-foreground">Click en Link</h4>
            <p className="text-xs text-muted-foreground">+15 puntos de engagement</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-6 w-6 text-green-400 mb-2" />
            <h4 className="font-medium text-foreground">Lead Caliente</h4>
            <p className="text-xs text-muted-foreground">Múltiples interacciones = Alta prioridad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAnalytics;
