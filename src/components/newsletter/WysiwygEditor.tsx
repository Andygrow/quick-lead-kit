import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { useEffect, useCallback } from 'react';
import WysiwygToolbar from './WysiwygToolbar';

interface WysiwygEditorProps {
  content: string;
  onContentChange: (html: string) => void;
}

const WysiwygEditor = ({ content, onContentChange }: WysiwygEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color:#0052e2;text-decoration:underline;',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
      },
    },
  });

  // Sync external content changes (templates, duplicates, drafts)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertImage = useCallback((url: string, width?: string, align?: string) => {
    if (!editor) return;
    // For email-compatible images, we insert raw HTML
    const style = [
      width ? `width:${width}` : 'max-width:100%',
      'height:auto',
      align === 'center' ? 'display:block;margin:0 auto' : '',
      align === 'right' ? 'display:block;margin-left:auto' : '',
    ].filter(Boolean).join(';');
    
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const insertCTA = useCallback((url: string, text: string) => {
    if (!editor) return;
    const ctaHtml = `<div style="text-align:center;margin:24px 0;"><a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0052e2,#ff6d00);color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none;border-radius:8px;">${text || 'Ver más'}</a></div>`;
    editor.chain().focus().insertContent(ctaHtml).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden max-h-[70vh] flex flex-col">
      <div className="sticky top-0 z-10">
        <WysiwygToolbar editor={editor} onInsertCTA={insertCTA} />
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-1">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .ProseMirror {
          min-height: 200px;
        }
        .ProseMirror p {
          margin: 0.25em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.15em 0;
        }
        .ProseMirror h1 {
          font-size: 1.5em;
          font-weight: 700;
          margin: 0.5em 0 0.25em;
        }
        .ProseMirror h2 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.5em 0 0.25em;
        }
        .ProseMirror a {
          color: #0052e2;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror img {
          max-width: 100%;
          width: auto;
          height: auto;
          border-radius: 4px;
          display: block;
          object-fit: contain;
        }
        .ProseMirror {
          overflow-x: hidden;
          word-break: break-word;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1em 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          color: #6b7280;
          margin: 0.5em 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default WysiwygEditor;
