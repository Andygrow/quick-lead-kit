import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Activity,
  MousePointerClick,
  FormInput,
  Calculator,
  RefreshCw,
  Trash2,
  TrendingUp,
  Eye,
  BarChart3,
} from 'lucide-react';

// Define GTM event interface
export interface GTMEvent {
  id: string;
  event: string;
  timestamp: Date;
  data: Record<string, any>;
}

const STORAGE_KEY = 'gtm_events_store';

// Load events from localStorage
const loadEventsFromStorage = (): GTMEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
    }
  } catch (e) {
    console.error('Error loading GTM events from storage:', e);
  }
  return [];
};

// Save events to localStorage
const saveEventsToStorage = (events: GTMEvent[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, 500)));
  } catch (e) {
    console.error('Error saving GTM events to storage:', e);
  }
};

// Event store - initialized from localStorage
export const gtmEventStore: GTMEvent[] = loadEventsFromStorage();

// Subscribe to events for real-time updates
type EventListener = (events: GTMEvent[]) => void;
const listeners: EventListener[] = [];

export const subscribeToGTMEvents = (listener: EventListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

export const addGTMEvent = (event: Omit<GTMEvent, 'id' | 'timestamp'>) => {
  const newEvent: GTMEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    ...event,
  };
  gtmEventStore.unshift(newEvent); // Add to beginning
  if (gtmEventStore.length > 500) gtmEventStore.pop(); // Keep max 500 events
  saveEventsToStorage(gtmEventStore); // Persist to localStorage
  listeners.forEach(l => l([...gtmEventStore]));
};

export const clearGTMEvents = () => {
  gtmEventStore.length = 0;
  localStorage.removeItem(STORAGE_KEY);
  listeners.forEach(l => l([]));
};

// Event type config for display
const eventConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  lead_form_submit: {
    label: 'Envío de Formulario',
    icon: <FormInput className="h-4 w-4" />,
    color: 'hsl(142, 76%, 36%)',
  },
  cta_click: {
    label: 'Clic en CTA',
    icon: <MousePointerClick className="h-4 w-4" />,
    color: 'hsl(221, 83%, 53%)',
  },
  roi_calculation_complete: {
    label: 'Cálculo ROI',
    icon: <Calculator className="h-4 w-4" />,
    color: 'hsl(45, 93%, 47%)',
  },
  roi_calculator_reset: {
    label: 'Reset Calculadora',
    icon: <RefreshCw className="h-4 w-4" />,
    color: 'hsl(0, 72%, 51%)',
  },
  page_view: {
    label: 'Vista de Página',
    icon: <Eye className="h-4 w-4" />,
    color: 'hsl(271, 81%, 56%)',
  },
};

const getEventConfig = (eventName: string) => {
  return eventConfig[eventName] || {
    label: eventName,
    icon: <Activity className="h-4 w-4" />,
    color: 'hsl(215, 20%, 65%)',
  };
};

const GTMAnalytics = () => {
  const [events, setEvents] = useState<GTMEvent[]>([...gtmEventStore]);

  useEffect(() => {
    const unsubscribe = subscribeToGTMEvents(setEvents);
    return unsubscribe;
  }, []);

  // Aggregate data for charts
  const eventsByType = events.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(eventsByType).map(([name, count]) => ({
    name: getEventConfig(name).label,
    value: count,
    color: getEventConfig(name).color,
    originalName: name,
  }));

  // Events per hour (last 24 hours aggregation)
  const eventsPerHour = events.reduce((acc, event) => {
    const hour = format(event.timestamp, 'HH:00');
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hourlyData = Object.entries(eventsPerHour)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([hour, count]) => ({ hour, count }));

  const chartConfig = {
    value: { label: 'Eventos', color: 'hsl(var(--primary))' },
    count: { label: 'Eventos', color: 'hsl(var(--primary))' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Eventos GTM en Tiempo Real
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitorea los eventos capturados durante esta sesión
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1.5 text-sm border-primary/30">
            <Activity className="h-3.5 w-3.5 mr-1.5 text-primary animate-pulse" />
            {events.length} eventos
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={clearGTMEvents}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(eventsByType).slice(0, 4).map(([eventName, count]) => {
          const config = getEventConfig(eventName);
          return (
            <Card key={eventName} className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <span style={{ color: config.color }}>{config.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {config.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Type */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Sin eventos registrados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events per Hour */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Eventos por Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hourlyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px]">
                <BarChart data={hourlyData}>
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Sin datos temporales</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Log Table */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Historial de Eventos (últimos 50)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="w-[180px]">Hora</TableHead>
                  <TableHead className="w-[200px]">Evento</TableHead>
                  <TableHead>Datos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>No hay eventos registrados.</p>
                      <p className="text-xs mt-1">Los eventos se capturarán aquí en tiempo real.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  events.slice(0, 50).map((event) => {
                    const config = getEventConfig(event.event);
                    return (
                      <TableRow key={event.id} className="border-border/20">
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {format(event.timestamp, 'dd/MM HH:mm:ss', { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span style={{ color: config.color }}>{config.icon}</span>
                            <span className="text-sm font-medium">{config.label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[400px]">
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded text-muted-foreground line-clamp-2">
                            {JSON.stringify(event.data, null, 0)}
                          </code>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default GTMAnalytics;
