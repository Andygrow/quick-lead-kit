interface FooterProps {
  companyName: string;
}

export const Footer = ({ companyName }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} {companyName}. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};