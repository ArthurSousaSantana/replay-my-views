const AdminFooter = () => (
  <footer className="bg-card border-t border-border py-8">
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm text-muted-foreground">
        © 2023 TechDeals Admin Console. Todos os direitos reservados.
      </p>
      <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-muted-foreground">
        <a className="hover:text-primary transition-colors" href="#">Políticas de Uso</a>
        <a className="hover:text-primary transition-colors" href="#">Segurança</a>
        <a className="hover:text-primary transition-colors" href="#">Suporte Técnico</a>
      </div>
    </div>
  </footer>
);

export default AdminFooter;
