import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => (
  <div className="bg-background text-foreground">
    <Navbar />
    {children}
    <Footer />
  </div>
);

export default PublicLayout;
