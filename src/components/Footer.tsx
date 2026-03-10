import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-surface border-t border-border pt-16 pb-8 mt-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">DescontoGamer</h3>
          <p className="text-sm text-muted-foreground">
            Sua fonte número um para as melhores ofertas de tecnologia e hardware de alto desempenho.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Navegação</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/builds" className="hover:text-primary transition-colors">Builds de PC</Link></li>
            <li><a className="hover:text-primary transition-colors" href="#">Laptops</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Componentes</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Periféricos</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Suporte</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a className="hover:text-primary transition-colors" href="#">Central de Ajuda</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Garantia</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Devoluções</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Receba as melhores ofertas primeiro.</p>
          <div className="flex gap-2">
            <input className="bg-muted border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-primary" placeholder="Seu e-mail" type="email" />
            <button className="bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">OK</button>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>© 2023 TechDeals. Todos os direitos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a className="hover:text-foreground" href="#">Privacidade</a>
          <a className="hover:text-foreground" href="#">Termos</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
