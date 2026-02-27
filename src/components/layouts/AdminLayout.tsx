import AdminNavbar from "@/components/AdminNavbar";
import AdminFooter from "@/components/AdminFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const AdminLayout = ({ children, hideFooter = false }: AdminLayoutProps) => (
  <div className="min-h-screen bg-background">
    <AdminNavbar />
    {children}
    {!hideFooter && <AdminFooter />}
  </div>
);

export default AdminLayout;
