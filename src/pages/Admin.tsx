import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  LogOut, 
  RefreshCw, 
  Calendar,
  Mail,
  Building,
  User,
  ExternalLink,
  Radio,
  Pause,
  Play
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import AdminCharts from '@/components/AdminCharts';
import DateRangeFilter, { DateRange } from '@/components/DateRangeFilter';
import AdminSettings from '@/components/AdminSettings';
import SalesPipeline from '@/components/SalesPipeline';
import GTMSettings from '@/components/GTMSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Kanban, Settings, Activity, Users, Newspaper } from 'lucide-react';
import EmailSequences from '@/components/email/EmailSequences';
import GTMAnalytics from '@/components/GTMAnalytics';
import UserManagement from '@/components/UserManagement';
import NewsletterManager from '@/components/newsletter/NewsletterManager';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string;
  role: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  is_corporate_email: boolean;
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

// Type to handle JSON from Supabase
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

const AUTO_REFRESH_INTERVAL = 60; // seconds

const Admin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter leads by date range
  const filteredLeads = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return leads;
    }
    
    return leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(leadDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        });
      }
      
      if (dateRange.from) {
        return leadDate >= startOfDay(dateRange.from);
      }
      
      return true;
    });
  }, [leads, dateRange]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        fetchLeads();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      // Fetch all leads from consolidated leads table
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;
      
      // Map leads with source_table for compatibility and cast quiz_answers
      const allLeads: Lead[] = (leadsData || []).map(lead => ({
        ...lead,
        source_table: 'leads' as const,
        quiz_answers: lead.quiz_answers as Record<string, number> | null,
      }));

      setLeads(allLeads);
      setLastUpdated(new Date());
      setCountdown(AUTO_REFRESH_INTERVAL);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      if (!silent) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los leads",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh || !user) return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchLeads(true);
          return AUTO_REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [autoRefresh, user, fetchLeads]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay leads para exportar",
      });
      return;
    }

    const headers = [
      'Fecha',
      'Nombre',
      'Email',
      'Empresa',
      'Rol',
      'Calidad',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Term'
    ];

    const rows = leads.map(lead => [
      format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm'),
      lead.name,
      lead.email,
      lead.company,
      lead.role,
      lead.lead_quality,
      lead.utm_source || '',
      lead.utm_medium || '',
      lead.utm_campaign || '',
      lead.utm_term || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: "Exportación exitosa",
      description: `Se exportaron ${leads.length} leads`,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="template-theme min-h-screen bg-background text-foreground relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Panel de <span className="text-primary">Leads</span>
              </h1>
              {autoRefresh && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <Radio className="h-3 w-3 text-primary rec-indicator" />
                  <span className="text-xs text-primary font-semibold">En vivo</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona y exporta tus leads capturados
              {lastUpdated && (
                <span className="ml-2 text-xs text-primary">
                  · Última actualización: {format(lastUpdated, 'HH:mm:ss', { locale: es })}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-xs font-medium">
                {autoRefresh ? (
                  <span className="flex items-center gap-1 text-primary">
                    <Play className="h-3 w-3" />
                    {countdown}s
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Pause className="h-3 w-3" />
                    Pausado
                  </span>
                )}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchLeads(false)}
              disabled={isLoading}
              className="border-border text-foreground hover:bg-muted"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button 
              size="sm"
              onClick={exportToCSV}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Date Filter */}
      <div className="container pt-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Filtrar por período:</span>
          </div>
          <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
        {(dateRange.from || dateRange.to) && (
          <p className="text-xs text-primary">
            Mostrando <span className="font-bold">{filteredLeads.length}</span> de {leads.length} leads
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="container py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{filteredLeads.length}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  {filteredLeads.filter(l => l.lead_quality === 'high').length}
                </p>
                <p className="text-sm text-muted-foreground">Alta Calidad</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-500">
                  {filteredLeads.filter(l => l.lead_quality === 'low').length}
                </p>
                <p className="text-sm text-muted-foreground">Baja Calidad</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {filteredLeads.filter(l => {
                    const today = new Date();
                    const leadDate = new Date(l.created_at);
                    return leadDate.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">Hoy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="bg-muted border border-border p-1.5 h-auto flex-wrap">
            <TabsTrigger 
              value="pipeline" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Kanban className="h-4 w-4" />
              <span className="font-semibold">Pipeline de Ventas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-semibold">Analíticas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="emails" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Mail className="h-4 w-4" />
              <span className="font-semibold">Email Marketing</span>
            </TabsTrigger>
            <TabsTrigger 
              value="newsletter" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Newspaper className="h-4 w-4" />
              <span className="font-semibold">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gtm" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-4 w-4" />
              <span className="font-semibold">Eventos GTM</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="font-semibold">Configuración</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <SalesPipeline 
              leads={filteredLeads} 
              isLoading={isLoading}
              onLeadsUpdate={() => fetchLeads(true)}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdminCharts leads={filteredLeads} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <EmailSequences />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <NewsletterManager />
          </TabsContent>

          <TabsContent value="gtm" className="space-y-6">
            <GTMAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <UserManagement />
            <GTMSettings />
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
