import { Bold, Italic, Underline, Link, Type, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Strikethrough, Minus, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface RichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  onContentChange: (content: string) => void;
}

const RichTextToolbar = ({ textareaRef, content, onContentChange }: RichTextToolbarProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [ctaUrl, setCtaUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaOpen, setCtaOpen] = useState(false);

  const getSelection = () => {
    const ta = textareaRef.current;
    if (!ta) return { start: 0, end: 0, text: '' };
    return {
      start: ta.selectionStart,
      end: ta.selectionEnd,
      text: content.substring(ta.selectionStart, ta.selectionEnd),
    };
  };

  const wrapSelection = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end) || 'texto';
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    onContentChange(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + selected.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const insertAtCursor = (html: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newContent = content.substring(0, start) + html + content.substring(end);
    onContentChange(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      const newPos = start + html.length;
      ta.setSelectionRange(newPos, newPos);
    });
  };

  const handleFontSize = (size: string) => {
    const pxMap: Record<string, string> = { small: '13px', normal: '16px', large: '20px', xlarge: '26px' };
    wrapSelection(`<span style="font-size:${pxMap[size]};">`, '</span>');
  };

  const handleColor = (color: string) => {
    wrapSelection(`<span style="color:${color};">`, '</span>');
  };

  const handleLink = () => {
    if (!linkUrl.trim()) return;
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selectedText = content.substring(start, end);
    const label = selectedText || linkUrl;
    const tag = `<a href="${linkUrl}" style="color:#0052e2;text-decoration:underline;" target="_blank">${label}</a>`;
    const newContent = content.substring(0, start) + tag + content.substring(end);
    onContentChange(newContent);
    setLinkUrl('');
    setLinkOpen(false);
  };

  const handleCta = () => {
    if (!ctaUrl.trim()) return;
    const label = ctaText.trim() || 'Ver más';
    const tag = `\n<div style="text-align:center;margin:24px 0;"><a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0052e2,#ff6d00);color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none;border-radius:8px;">${label}</a></div>\n`;
    insertAtCursor(tag);
    setCtaUrl('');
    setCtaText('');
    setCtaOpen(false);
  };

  const btnClass = "h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  return (
    <div className="flex items-center gap-0.5 flex-wrap border border-gray-200 rounded-t-md bg-gray-50/80 px-1.5 py-1">
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Negrita" onClick={() => wrapSelection('<strong>', '</strong>')}>
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Cursiva" onClick={() => wrapSelection('<em>', '</em>')}>
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Subrayado" onClick={() => wrapSelection('<u>', '</u>')}>
        <Underline className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Tachado" onClick={() => wrapSelection('<s>', '</s>')}>
        <Strikethrough className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <Select onValueChange={handleFontSize}>
        <SelectTrigger className="h-8 w-[90px] text-xs border-gray-200 bg-white">
          <Type className="h-3 w-3 mr-1" />
          <SelectValue placeholder="Tamaño" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Pequeño</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="large">Grande</SelectItem>
          <SelectItem value="xlarge">Título</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <Select onValueChange={handleColor}>
        <SelectTrigger className="h-8 w-[80px] text-xs border-gray-200 bg-white">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="#1a1a1a"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1a1a1a]" />Negro</span></SelectItem>
          <SelectItem value="#0052e2"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0052e2]" />Azul</span></SelectItem>
          <SelectItem value="#ff6d00"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff6d00]" />Naranja</span></SelectItem>
          <SelectItem value="#16a34a"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#16a34a]" />Verde</span></SelectItem>
          <SelectItem value="#dc2626"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#dc2626]" />Rojo</span></SelectItem>
          <SelectItem value="#7c3aed"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#7c3aed]" />Morado</span></SelectItem>
        </SelectContent>
      </Select>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Alinear izquierda" onClick={() => wrapSelection('<div style="text-align:left;">', '</div>')}>
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Centrar" onClick={() => wrapSelection('<div style="text-align:center;">', '</div>')}>
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Alinear derecha" onClick={() => wrapSelection('<div style="text-align:right;">', '</div>')}>
        <AlignRight className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Lista" onClick={() => insertAtCursor('\n<ul>\n  <li>Elemento</li>\n</ul>\n')}>
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Lista numerada" onClick={() => insertAtCursor('\n<ol>\n  <li>Elemento</li>\n</ol>\n')}>
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className={btnClass} title="Enlace">
            <Link className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <p className="text-xs text-gray-500 mb-2">Selecciona texto primero, luego pega la URL</p>
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className="text-sm h-8"
              onKeyDown={e => e.key === 'Enter' && handleLink()}
            />
            <Button size="sm" className="h-8 shrink-0" onClick={handleLink}>OK</Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Separador" onClick={() => insertAtCursor('\n<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />\n')}>
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <Popover open={ctaOpen} onOpenChange={setCtaOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className={btnClass} title="Botón CTA">
            <MousePointerClick className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 space-y-2" align="start">
          <p className="text-xs text-gray-500">Insertar botón de acción</p>
          <Input placeholder="Texto del botón" value={ctaText} onChange={e => setCtaText(e.target.value)} className="text-sm h-8" />
          <div className="flex gap-2">
            <Input placeholder="https://..." value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} className="text-sm h-8" onKeyDown={e => e.key === 'Enter' && handleCta()} />
            <Button size="sm" className="h-8 shrink-0" onClick={handleCta}>OK</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RichTextToolbar;
