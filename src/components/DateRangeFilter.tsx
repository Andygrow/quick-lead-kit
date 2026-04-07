import { useState } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const presets = [
  { label: 'Hoy', days: 0 },
  { label: '7 días', days: 7 },
  { label: '14 días', days: 14 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>({ from: undefined, to: undefined });

  const handleOpen = (open: boolean) => {
    if (open) {
      setTempRange(dateRange);
    }
    setIsOpen(open);
  };

  const handlePresetClick = (days: number) => {
    const today = endOfDay(new Date());
    const from = days === 0 ? startOfDay(today) : startOfDay(subDays(today, days - 1));
    onDateRangeChange({ from, to: today });
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onDateRangeChange(tempRange);
    setIsOpen(false);
  };

  const handleClear = () => {
    onDateRangeChange({ from: undefined, to: undefined });
    setTempRange({ from: undefined, to: undefined });
  };

  const getDisplayText = () => {
    if (!dateRange.from && !dateRange.to) {
      return 'Seleccionar período';
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'dd MMM', { locale: es })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: es })}`;
    }
    if (dateRange.from) {
      return format(dateRange.from, 'dd MMM yyyy', { locale: es });
    }
    return 'Seleccionar período';
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'justify-start text-left font-normal min-w-[180px] bg-card border-border text-foreground hover:bg-muted',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card border-border shadow-lg" align="end">
          <div className="flex flex-col sm:flex-row">
            {/* Presets */}
            <div className="border-b sm:border-b-0 sm:border-r border-border p-2">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Rápido
              </p>
              <div className="flex flex-wrap sm:flex-col gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs px-2 py-1 h-7 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => handlePresetClick(preset.days)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Calendar */}
            <div className="p-2">
              <Calendar
                mode="range"
                selected={{ from: tempRange.from, to: tempRange.to }}
                onSelect={(range) => {
                  setTempRange({
                    from: range?.from,
                    to: range?.to,
                  });
                }}
                numberOfMonths={1}
                locale={es}
                className="pointer-events-auto"
              />
              
              {/* Confirm button */}
              <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground">
                  {tempRange.from && tempRange.to 
                    ? `${format(tempRange.from, 'dd/MM')} - ${format(tempRange.to, 'dd/MM')}`
                    : tempRange.from 
                      ? `Desde ${format(tempRange.from, 'dd/MM')}`
                      : 'Selecciona fechas'
                  }
                </p>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  disabled={!tempRange.from}
                  className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(dateRange.from || dateRange.to) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
