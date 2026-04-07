import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ImageSettings {
  width: number;
  borderRadius: number;
  marginTop: number;
  marginBottom: number;
  alignment: 'left' | 'center' | 'right';
  alt: string;
}

interface ImageSettingsModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onInsert: (imgTag: string) => void;
}

const ImageSettingsModal = ({ open, onClose, imageUrl, onInsert }: ImageSettingsModalProps) => {
  const [settings, setSettings] = useState<ImageSettings>({
    width: 100,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    alignment: 'center',
    alt: 'Newsletter image',
  });

  const getAlignmentStyle = () => {
    switch (settings.alignment) {
      case 'left': return 'margin-right:auto;';
      case 'right': return 'margin-left:auto;';
      case 'center': return 'margin-left:auto;margin-right:auto;';
    }
  };

  const generateImgTag = () => {
    const style = `max-width:${settings.width}%;width:${settings.width}%;height:auto;border-radius:${settings.borderRadius}px;margin-top:${settings.marginTop}px;margin-bottom:${settings.marginBottom}px;display:block;${getAlignmentStyle()}`;
    return `<img src="${imageUrl}" alt="${settings.alt}" style="${style}" />`;
  };

  const handleInsert = () => {
    onInsert(generateImgTag());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Configurar imagen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 overflow-hidden">
            <p className="text-xs text-gray-400 mb-1">Vista previa</p>
            <div className="max-h-[200px] overflow-hidden" dangerouslySetInnerHTML={{ __html: generateImgTag() }} />
          </div>

          {/* Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">Ancho</Label>
              <span className="text-sm text-gray-500 font-mono">{settings.width}%</span>
            </div>
            <Slider
              value={[settings.width]}
              onValueChange={v => setSettings(s => ({ ...s, width: v[0] }))}
              min={20}
              max={100}
              step={5}
            />
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">Bordes redondeados</Label>
              <span className="text-sm text-gray-500 font-mono">{settings.borderRadius}px</span>
            </div>
            <Slider
              value={[settings.borderRadius]}
              onValueChange={v => setSettings(s => ({ ...s, borderRadius: v[0] }))}
              min={0}
              max={32}
              step={2}
            />
          </div>

          {/* Margins */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Margen superior</Label>
                <span className="text-xs text-gray-500 font-mono">{settings.marginTop}px</span>
              </div>
              <Slider
                value={[settings.marginTop]}
                onValueChange={v => setSettings(s => ({ ...s, marginTop: v[0] }))}
                min={0}
                max={48}
                step={4}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Margen inferior</Label>
                <span className="text-xs text-gray-500 font-mono">{settings.marginBottom}px</span>
              </div>
              <Slider
                value={[settings.marginBottom]}
                onValueChange={v => setSettings(s => ({ ...s, marginBottom: v[0] }))}
                min={0}
                max={48}
                step={4}
              />
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">Alineación</Label>
            <div className="flex gap-2">
              {([
                { value: 'left', icon: AlignLeft, label: 'Izquierda' },
                { value: 'center', icon: AlignCenter, label: 'Centro' },
                { value: 'right', icon: AlignRight, label: 'Derecha' },
              ] as const).map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={settings.alignment === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSettings(s => ({ ...s, alignment: value }))}
                  className={settings.alignment === value ? 'bg-primary text-white' : 'border-gray-200'}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Alt text */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">Texto alternativo</Label>
            <Input
              value={settings.alt}
              onChange={e => setSettings(s => ({ ...s, alt: e.target.value }))}
              placeholder="Descripción de la imagen"
              className="border-gray-200"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-gray-200">
            Cancelar
          </Button>
          <Button onClick={handleInsert} className="bg-primary text-white hover:bg-primary/90">
            Insertar imagen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSettingsModal;
