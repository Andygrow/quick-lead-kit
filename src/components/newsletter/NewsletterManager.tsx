import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Upload,
  Send,
  Users,
  FileText,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  Loader2,
  ImagePlus,
  Copy,
  LayoutTemplate,
  Search,
  Tag,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ImageSettingsModal from './ImageSettingsModal';
import WysiwygEditor from './WysiwygEditor';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: string;
  audience: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  sent_at: string | null;
  completed_at: string | null;
}

interface NewsletterContact {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  is_active: boolean;
  created_at: string;
  tags?: string[];
}

const NEWSLETTER_TEMPLATES = [
  {
    name: 'Promoción',
    subject: '🔥 Oferta especial para ti',
    content: '<strong>¡Hola!</strong>\n\nTenemos una oferta especial que no querrás perderte.\n\n<div style="text-align:center;margin:24px 0;"><a href="https://tu-enlace.com" target="_blank" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0052e2,#ff6d00);color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none;border-radius:8px;">Ver oferta</a></div>\n\n¡No dejes pasar esta oportunidad!\n\nSaludos,\nEl equipo',
  },
  {
    name: 'Contenido / Valor',
    subject: 'Nuevo contenido que te interesa',
    content: '<strong>¡Hola!</strong>\n\nEsta semana queremos compartirte contenido que te ayudará a crecer profesionalmente.\n\n<span style="font-size:20px;"><strong>📌 Tema principal</strong></span>\n\nAquí va el contenido de valor...\n\n<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />\n\n<em>¿Te resultó útil? Compártelo con alguien que lo necesite.</em>',
  },
  {
    name: 'Anuncio / Novedad',
    subject: '📢 Importante: Novedad que debes conocer',
    content: '<strong>¡Hola!</strong>\n\nQueremos contarte algo importante.\n\n<span style="font-size:20px;"><strong>Lo nuevo</strong></span>\n\nDescripción del anuncio o novedad...\n\n<strong>¿Qué significa para ti?</strong>\n\nExplicación del impacto...\n\nSaludos,\nEl equipo',
  },
];

const NewsletterManager = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [contacts, setContacts] = useState<NewsletterContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // Composer state
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  

  // Contacts state
  const [contactSearch, setContactSearch] = useState('');
  const [newTag, setNewTag] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [nlRes, contactsRes] = await Promise.all([
        supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('newsletter_contacts')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      setNewsletters((nlRes.data as Newsletter[]) || []);
      setContacts((contactsRes.data as NewsletterContact[]) || []);
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse CSV line respecting quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length === 0) {
        toast({ title: 'Error', description: 'Archivo CSV vacío', variant: 'destructive' });
        return;
      }

      // Detect header columns (case-insensitive)
      const headerRaw = parseCSVLine(lines[0]);
      const header = headerRaw.map(h => h.toLowerCase().replace(/^"|"$/g, '').trim());

      // Map known column names to indices
      const emailIdx = header.findIndex(h => ['correo', 'email', 'e-mail', 'mail'].includes(h));
      const nameIdx = header.findIndex(h => ['nombre', 'name', 'first name', 'first_name'].includes(h));
      const lastNameIdx = header.findIndex(h => ['apellido', 'last name', 'last_name', 'surname'].includes(h));
      const tagIdx = header.findIndex(h => ['tag', 'tags', 'etiqueta', 'etiquetas'].includes(h));

      const hasHeader = emailIdx !== -1;
      const startIdx = hasHeader ? 1 : 0;

      const parsed: { email: string; name: string | null; tags: string[] }[] = [];

      for (let i = startIdx; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]).map(c => c.replace(/^"|"$/g, '').trim());

        let email: string | undefined;
        let name: string | null = null;
        let tags: string[] = [];

        if (hasHeader) {
          email = emailIdx >= 0 ? cols[emailIdx] : undefined;
          const firstName = nameIdx >= 0 ? cols[nameIdx] : '';
          const lastName = lastNameIdx >= 0 ? cols[lastNameIdx] : '';
          name = [firstName, lastName].filter(Boolean).join(' ') || null;
          if (tagIdx >= 0 && cols[tagIdx]) {
            tags = cols[tagIdx].split(';').map(t => t.trim()).filter(Boolean);
            if (tags.length === 0 && cols[tagIdx].trim()) tags = [cols[tagIdx].trim()];
          }
        } else {
          email = cols.find(c => c.includes('@'));
          name = cols.find(c => !c.includes('@') && c.length > 1) || null;
        }

        if (email && email.includes('@')) {
          parsed.push({ email: email.toLowerCase().trim(), name, tags });
        }
      }

      if (parsed.length === 0) {
        toast({ title: 'Error', description: 'No se encontraron emails válidos en el CSV', variant: 'destructive' });
        return;
      }

      // Upsert contacts
      let insertedCount = 0;
      for (let i = 0; i < parsed.length; i += 50) {
        const batch = parsed.slice(i, i + 50).map(c => ({
          email: c.email,
          name: c.name,
          source: 'csv',
          is_active: true,
          tags: c.tags.length > 0 ? c.tags : undefined,
        }));

        const { error } = await supabase
          .from('newsletter_contacts')
          .upsert(batch, { onConflict: 'email', ignoreDuplicates: true });

        if (!error) insertedCount += batch.length;
      }

      toast({
        title: 'CSV procesado',
        description: `${insertedCount} contactos importados de ${parsed.length} encontrados`,
      });
      fetchData();
    } catch (error) {
      console.error('CSV upload error:', error);
      toast({ title: 'Error', description: 'Error al procesar el archivo CSV', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Solo se permiten archivos de imagen', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'La imagen no debe superar 5MB', variant: 'destructive' });
      return;
    }

    setIsUploadingImage(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `newsletter/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('email-assets')
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('email-assets')
        .getPublicUrl(fileName);

      setPendingImageUrl(urlData.publicUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      toast({ title: 'Error', description: 'Error al subir la imagen', variant: 'destructive' });
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSendTest = async () => {
    if (!subject.trim() || !content.trim() || !testEmail.trim()) {
      toast({ title: 'Error', description: 'Asunto, contenido y email de prueba son requeridos', variant: 'destructive' });
      return;
    }

    setIsSendingTest(true);
    try {
      const response = await supabase.functions.invoke('send-newsletter', {
        body: { test_email: testEmail.trim(), subject, content },
      });

      if (response.error) {
        toast({ title: 'Error', description: 'Error al enviar email de prueba', variant: 'destructive' });
      } else {
        toast({ title: '¡Email de prueba enviado!', description: `Enviado a ${testEmail}` });
      }
    } catch (error) {
      console.error('Test send error:', error);
      toast({ title: 'Error', description: 'Error al enviar', variant: 'destructive' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveAndSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({ title: 'Error', description: 'Asunto y contenido son requeridos', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    try {
      let nlId = editingDraftId;

      if (nlId) {
        // Update existing draft before sending
        await supabase.from('newsletters').update({ subject, content, audience }).eq('id', nlId);
      } else {
        // Create new newsletter record
        const { data: nl, error: insertError } = await supabase
          .from('newsletters')
          .insert({ subject, content, audience, status: 'draft' })
          .select()
          .single();
        if (insertError || !nl) throw insertError;
        nlId = nl.id;
      }

      // Trigger send via edge function
      const response = await supabase.functions.invoke('send-newsletter', {
        body: { newsletter_id: nlId },
      });

      if (response.error) {
        toast({ title: 'Error', description: 'Error al enviar newsletter', variant: 'destructive' });
      } else {
        toast({ title: '¡Newsletter enviado!', description: `Enviando a ${response.data?.sent || 0} destinatarios` });
        setSubject('');
        setContent('');
        setShowPreview(false);
        setEditingDraftId(null);
      }

      fetchData();
    } catch (error) {
      console.error('Send error:', error);
      toast({ title: 'Error', description: 'Error al crear newsletter', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject.trim() && !content.trim()) {
      toast({ title: 'Error', description: 'Escribe al menos el asunto o contenido para guardar', variant: 'destructive' });
      return;
    }
    setIsSavingDraft(true);
    try {
      if (editingDraftId) {
        const { error } = await supabase
          .from('newsletters')
          .update({ subject, content, audience })
          .eq('id', editingDraftId);
        if (error) throw error;
        toast({ title: 'Borrador actualizado', description: 'Los cambios se guardaron correctamente' });
      } else {
        const { data: nl, error } = await supabase
          .from('newsletters')
          .insert({ subject, content, audience, status: 'draft' })
          .select()
          .single();
        if (error) throw error;
        setEditingDraftId(nl.id);
        toast({ title: 'Borrador guardado', description: 'Puedes continuar editándolo más tarde' });
      }
      fetchData();
    } catch (error) {
      console.error('Save draft error:', error);
      toast({ title: 'Error', description: 'Error al guardar borrador', variant: 'destructive' });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleLoadDraft = (nl: Newsletter) => {
    setSubject(nl.subject);
    setContent(nl.content);
    setAudience(nl.audience);
    setEditingDraftId(nl.id);
    toast({ title: 'Borrador cargado', description: 'Puedes continuar editándolo' });
  };

  const handleDeleteContact = async (id: string) => {
    await supabase.from('newsletter_contacts').delete().eq('id', id);
    fetchData();
  };

  const handleDuplicateNewsletter = (nl: Newsletter) => {
    setSubject(nl.subject);
    setContent(nl.content);
    setAudience(nl.audience);
    setEditingDraftId(null);
    toast({ title: 'Newsletter duplicado', description: 'Contenido cargado en el editor. Puedes modificarlo antes de enviar.' });
  };

  const handleApplyTemplate = (tpl: typeof NEWSLETTER_TEMPLATES[0]) => {
    setSubject(tpl.subject);
    setContent(tpl.content);
    toast({ title: 'Plantilla aplicada', description: `"${tpl.name}" cargada en el editor` });
  };

  const handleAddTag = async (contactId: string, tag: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    const currentTags = contact.tags || [];
    if (currentTags.includes(tag)) return;
    const updatedTags = [...currentTags, tag];
    await supabase.from('newsletter_contacts').update({ tags: updatedTags } as any).eq('id', contactId);
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, tags: updatedTags } : c));
  };

  const handleRemoveTag = async (contactId: string, tag: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    const updatedTags = (contact.tags || []).filter(t => t !== tag);
    await supabase.from('newsletter_contacts').update({ tags: updatedTags } as any).eq('id', contactId);
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, tags: updatedTags } : c));
  };

  const filteredContacts = contacts.filter(c => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return (c.name?.toLowerCase().includes(q)) || c.email.toLowerCase().includes(q) || (c.tags || []).some(t => t.toLowerCase().includes(q));
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="secondary" className="bg-muted text-muted-foreground"><FileText className="h-3 w-3 mr-1" />Borrador</Badge>;
      case 'sending': return <Badge className="bg-blue-500/20 text-blue-400"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Enviando</Badge>;
      case 'sent': return <Badge className="bg-primary/20 text-primary"><CheckCircle2 className="h-3 w-3 mr-1" />Enviado</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAudienceLabel = (a: string) => {
    switch (a) {
      case 'all': return 'Todos';
      case 'leads': return 'Solo Leads';
      case 'contacts': return 'Solo Contactos CSV';
      default: return a;
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="compose" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" />Componer
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-1" />Historial
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4 mr-1" />Contactos
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  Componer Newsletter
                </span>
                <Select onValueChange={v => handleApplyTemplate(NEWSLETTER_TEMPLATES[parseInt(v)])}>
                  <SelectTrigger className="w-[160px] h-8 text-xs border-border">
                    <LayoutTemplate className="h-3.5 w-3.5 mr-1" />
                    <SelectValue placeholder="Plantillas" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {NEWSLETTER_TEMPLATES.map((tpl, i) => (
                      <SelectItem key={i} value={String(i)}>{tpl.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Asunto</label>
                <Input
                  placeholder="Escribe el asunto del email..."
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="border-border bg-input"
                  maxLength={200}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-foreground">Contenido</label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleInsertImage}
                      disabled={isUploadingImage}
                    />
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-foreground ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isUploadingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                      Insertar imagen
                    </span>
                  </label>
                </div>
                <WysiwygEditor
                  content={content}
                  onContentChange={setContent}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Audiencia</label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="border-border bg-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">Todos (Leads + Contactos CSV)</SelectItem>
                    <SelectItem value="leads">Solo Leads Registrados</SelectItem>
                    <SelectItem value="contacts">Solo Contactos CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Test Email Section */}
              <div className="border border-dashed border-border rounded-lg p-4 bg-muted/30">
                <label className="text-sm font-medium text-foreground mb-2 block">Enviar email de prueba</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder="email@ejemplo.com"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    className="border-border bg-input flex-1"
                    maxLength={255}
                  />
                  <Button
                    variant="outline"
                    onClick={handleSendTest}
                    disabled={isSendingTest || !subject.trim() || !content.trim() || !testEmail.trim()}
                    className="border-border shrink-0"
                  >
                    {isSendingTest ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Enviar Prueba
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Envía una copia exacta del newsletter a un email específico sin registrarlo en el historial</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="border-border"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Ocultar' : 'Vista Previa'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || (!subject.trim() && !content.trim())}
                  className="border-border"
                >
                  {isSavingDraft ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {editingDraftId ? 'Actualizar borrador' : 'Guardar borrador'}
                </Button>
                <Button
                  onClick={handleSaveAndSend}
                  disabled={isSending || !subject.trim() || !content.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Enviar Newsletter
                </Button>
                {editingDraftId && (
                  <span className="text-xs text-muted-foreground">Editando borrador</span>
                )}
              </div>

              {showPreview && subject && (
                <div className="border border-border rounded-lg overflow-hidden mt-4">
                  <div className="bg-muted px-4 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Vista previa del email (tal como llegará al destinatario)</p>
                  </div>
                  <div className="bg-[#f8f9fa] p-4">
                    <div className="max-w-[600px] mx-auto">
                      <div style={{ background: 'linear-gradient(135deg, #0052e2 0%, #ff6d00 100%)' }} className="p-6 text-center rounded-t-2xl">
                        <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png" alt="Elévate & Conecta" className="h-10 mx-auto" />
                      </div>
                      <div className="bg-white p-8 overflow-hidden">
                        <div
                          className="text-gray-700 text-base leading-relaxed overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_img]:block"
                          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
                        />
                      </div>
                      <div className="bg-[#1a1a2e] p-6 text-center rounded-b-2xl">
                        <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png" alt="Elévate & Conecta" className="h-8 mx-auto mb-2" />
                        <p className="text-white/70 text-xs">LinkedIn Strategy & Metodología CI+7</p>
                        <p className="text-white/50 text-[11px] mt-2">
                          Si no deseas recibir más correos, haz click <span className="underline">aquí para desuscribirte</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {pendingImageUrl && (
            <ImageSettingsModal
              open={!!pendingImageUrl}
              onClose={() => setPendingImageUrl(null)}
              imageUrl={pendingImageUrl}
              onInsert={(imgTag) => {
                setContent(prev => prev + (prev ? '\n' : '') + imgTag);
                setPendingImageUrl(null);
                toast({ title: 'Imagen insertada', description: 'La imagen se agregó al contenido' });
              }}
            />
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {newsletters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay newsletters enviados aún</p>
            </div>
          ) : (
            newsletters.map(nl => (
              <Card key={nl.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(nl.status)}
                        <Badge variant="outline" className="text-xs border-border">{getAudienceLabel(nl.audience)}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{nl.subject}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{nl.content}</p>
                    </div>
                    <div className="text-right ml-4 shrink-0 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(nl.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                      </p>
                      {nl.status === 'draft' && (
                        <div className="space-y-1">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleLoadDraft(nl)}
                            className="text-xs w-full"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Continuar editando
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!confirm('¿Eliminar este borrador?')) return;
                              const { error } = await supabase.from('newsletters').delete().eq('id', nl.id);
                              if (error) {
                                toast({ title: 'Error', description: 'No se pudo eliminar', variant: 'destructive' });
                              } else {
                                if (editingDraftId === nl.id) {
                                  setEditingDraftId(null);
                                  setSubject('');
                                  setContent('');
                                }
                                toast({ title: 'Borrador eliminado' });
                                fetchData();
                              }
                            }}
                            className="text-xs w-full border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateNewsletter(nl)}
                        className="text-xs border-border"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicar
                      </Button>
                      {nl.status !== 'draft' && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">{nl.total_recipients}</span> destinatarios
                          </p>
                          <p className="text-xs text-primary">
                            <CheckCircle2 className="h-3 w-3 inline mr-1" />{nl.sent_count} enviados
                          </p>
                          {nl.failed_count > 0 && (
                            <p className="text-xs text-destructive">
                              <AlertTriangle className="h-3 w-3 inline mr-1" />{nl.failed_count} fallidos
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Contactos Externos ({contacts.length})
                </span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCSVUpload}
                    disabled={isUploading}
                  />
                  <Button variant="outline" size="sm" asChild disabled={isUploading}>
                    <span>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Importar CSV
                    </span>
                  </Button>
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o etiqueta..."
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  className="pl-9 border-border bg-input"
                />
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {filteredContacts.length} de {contacts.length} contactos · Formato CSV: email y nombre. Se deduplican automáticamente.
              </p>
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Importa un archivo CSV para comenzar</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredContacts.map(c => (
                    <div key={c.id} className="p-3 rounded-lg bg-muted border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.name || 'Sin nombre'}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(c.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {(c.tags || []).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-primary/20 text-primary gap-1">
                            {tag}
                            <button onClick={() => handleRemoveTag(c.id, tag)} className="hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        <form
                          className="inline-flex"
                          onSubmit={e => {
                            e.preventDefault();
                            const input = (e.target as HTMLFormElement).elements.namedItem('tag') as HTMLInputElement;
                            if (input.value.trim()) {
                              handleAddTag(c.id, input.value.trim().toLowerCase());
                              input.value = '';
                            }
                          }}
                        >
                          <Input
                            name="tag"
                            placeholder="+ etiqueta"
                            className="h-6 w-20 text-xs border-dashed border-border px-1.5 bg-input"
                          />
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterManager;
