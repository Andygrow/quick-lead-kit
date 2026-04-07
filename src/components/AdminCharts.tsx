import { useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Users, Target } from 'lucide-react';
import { DateRange } from '@/components/DateRangeFilter';

interface Lead {
  id: string;
  created_at: string;
  utm_source: string | null;
  lead_quality: string;
}

interface AdminChartsProps {
  leads: Lead[];
  dateRange?: DateRange;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted-foreground))',
  high: 'hsl(142, 76%, 36%)',
  low: 'hsl(48, 96%, 53%)',
};

const AdminCharts = ({ leads, dateRange }: AdminChartsProps) => {
  // Leads por día - usa el rango de fechas si está definido, si no últimos 14 días
  const leadsPerDay = useMemo(() => {
    let startDate: Date;
    let endDate: Date;
    
    if (dateRange?.from && dateRange?.to) {
      startDate = startOfDay(dateRange.from);
      endDate = endOfDay(dateRange.to);
    } else {
      endDate = endOfDay(new Date());
      startDate = startOfDay(subDays(endDate, 13));
    }
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = leads.filter(lead => {
        const leadDay = format(new Date(lead.created_at), 'yyyy-MM-dd');
        return leadDay === dayStr;
      }).length;
      
      return {
        date: format(day, 'dd MMM', { locale: es }),
        leads: count,
      };
    });
  }, [leads, dateRange]);

  // Leads por UTM Source
  const leadsBySource = useMemo(() => {
    const sourceMap: Record<string, number> = {};
    
    leads.forEach(lead => {
      const source = lead.utm_source || 'Directo';
      sourceMap[source] = (sourceMap[source] || 0) + 1;
    });
    
    return Object.entries(sourceMap)
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / leads.length) * 100) || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [leads]);

  // Distribución de calidad
  const qualityDistribution = useMemo(() => {
    const high = leads.filter(l => l.lead_quality === 'high').length;
    const low = leads.filter(l => l.lead_quality === 'low').length;
    
    return [
      { name: 'Alta Calidad', value: high, color: COLORS.high },
      { name: 'Baja Calidad', value: low, color: COLORS.low },
    ];
  }, [leads]);

  const chartConfig = {
    leads: {
      label: 'Leads',
      color: COLORS.primary,
    },
    count: {
      label: 'Cantidad',
      color: COLORS.accent,
    },
  };

  if (leads.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 border border-primary/20 text-center">
        <p className="text-muted-foreground">
          Los gráficos aparecerán cuando captures tu primer lead
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Leads por día */}
      <div className="glass-card rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            Leads por Día
          </h3>
          {!dateRange?.from && (
            <span className="text-xs text-muted-foreground ml-auto">
              Últimos 14 días
            </span>
          )}
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={leadsPerDay}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              stroke={COLORS.primary}
              strokeWidth={2}
              dot={{ fill: COLORS.primary, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: COLORS.primary }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Leads por UTM Source */}
      <div className="glass-card rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-accent" />
          <h3 className="font-display font-semibold text-foreground">
            Conversión por Fuente
          </h3>
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={leadsBySource} layout="vertical">
            <XAxis 
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis 
              type="category"
              dataKey="source" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              fill={COLORS.accent}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Calidad de Leads */}
      <div className="glass-card rounded-xl p-6 border border-primary/20 lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            Calidad de Leads
          </h3>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ChartContainer config={chartConfig} className="h-[180px] w-[180px]">
            <PieChart>
              <Pie
                data={qualityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {qualityDistribution.map((entry, index) => (
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
          
          <div className="flex-1 grid grid-cols-2 gap-4">
            {qualityDistribution.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {leads.length > 0 ? Math.round((item.value / leads.length) * 100) : 0}% del total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
