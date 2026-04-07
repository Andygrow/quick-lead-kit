import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Minus, MousePointerClick,
  Heading1, Heading2, Quote, Undo, Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface WysiwygToolbarProps {
  editor: Editor;
  onInsertCTA: (url: string, text: string) => void;
}

const WysiwygToolbar = ({ editor, onInsertCTA }: WysiwygToolbarProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [ctaUrl, setCtaUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaOpen, setCtaOpen] = useState(false);

  const handleLink = () => {
    if (!linkUrl.trim()) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setLinkOpen(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkOpen(false);
  };

  const handleCta = () => {
    if (!ctaUrl.trim()) return;
    onInsertCTA(ctaUrl, ctaText.trim() || 'Ver más');
    setCtaUrl('');
    setCtaText('');
    setCtaOpen(false);
  };

  const btnClass = "h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100";
  const activeBtnClass = "h-8 w-8 p-0 bg-gray-200 text-gray-900 hover:bg-gray-300";

  const isActive = (type: string, attrs?: Record<string, unknown>) => editor.isActive(type, attrs);

  const colors = [
    { value: '#1a1a1a', label: 'Negro' },
    { value: '#0052e2', label: 'Azul' },
    { value: '#ff6d00', label: 'Naranja' },
    { value: '#16a34a', label: 'Verde' },
    { value: '#dc2626', label: 'Rojo' },
    { value: '#7c3aed', label: 'Morado' },
  ];

  return (
    <div className="flex items-center gap-0.5 flex-wrap border-b border-gray-200 bg-gray-50/80 px-1.5 py-1">
      {/* Undo/Redo */}
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Deshacer" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Rehacer" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Text formatting */}
      <Button type="button" variant="ghost" size="sm" className={isActive('bold') ? activeBtnClass : btnClass} title="Negrita" onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={isActive('italic') ? activeBtnClass : btnClass} title="Cursiva" onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={isActive('underline') ? activeBtnClass : btnClass} title="Subrayado" onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={isActive('strike') ? activeBtnClass : btnClass} title="Tachado" onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Headings */}
      <Button type="button" variant="ghost" size="sm" className={isActive('heading', { level: 1 }) ? activeBtnClass : btnClass} title="Título 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={isActive('heading', { level: 2 }) ? activeBtnClass : btnClass} title="Título 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Colors */}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className={btnClass} title="Color de texto">
            <span className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">A</span>
              <span className="w-3 h-1 rounded-sm" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#1a1a1a' }} />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {colors.map(c => (
              <button
                key={c.value}
                className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.value }}
                title={c.label}
                onClick={() => editor.chain().focus().setColor(c.value).run()}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Alignment */}
      <Button type="button" variant="ghost" size="sm" className={editor.isActive({ textAlign: 'left' }) ? activeBtnClass : btnClass} title="Alinear izquierda" onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={editor.isActive({ textAlign: 'center' }) ? activeBtnClass : btnClass} title="Centrar" onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={editor.isActive({ textAlign: 'right' }) ? activeBtnClass : btnClass} title="Alinear derecha" onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Lists */}
      <Button type="button" variant="ghost" size="sm" className={isActive('bulletList') ? activeBtnClass : btnClass} title="Lista" onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="sm" className={isActive('orderedList') ? activeBtnClass : btnClass} title="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Blockquote */}
      <Button type="button" variant="ghost" size="sm" className={isActive('blockquote') ? activeBtnClass : btnClass} title="Cita" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-3.5 w-3.5" />
      </Button>

      {/* Separator */}
      <Button type="button" variant="ghost" size="sm" className={btnClass} title="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Link */}
      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className={isActive('link') ? activeBtnClass : btnClass} title="Enlace">
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
          {isActive('link') && (
            <Button variant="ghost" size="sm" className="mt-2 text-xs text-destructive" onClick={handleRemoveLink}>
              Quitar enlace
            </Button>
          )}
        </PopoverContent>
      </Popover>

      {/* CTA Button */}
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

export default WysiwygToolbar;
