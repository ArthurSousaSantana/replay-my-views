import { Link } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Pagination from "@/components/shared/Pagination";

const products = [
  {
    name: "Smartphone Pro Max 256GB", badge: "Mobile", badgeColor: "text-primary bg-primary/10",
    category: "Smartphones", subCategory: "High-end Device", price: "R$ 5.099,00", discount: "-25% OFF",
    status: "Ativo", statusActive: true, icon: "smartphone",
  },
  {
    name: "GeForce RTX 4070 12GB", badge: "GPU", badgeColor: "text-purple-600 bg-purple-50",
    category: "Hardware", subCategory: "Placas de Vídeo", price: "R$ 4.049,00", discount: "-12% OFF",
    status: "Ativo", statusActive: true, icon: "videogame_asset",
  },
  {
    name: "Samsung 980 PRO NVMe 1TB", badge: "SSD", badgeColor: "text-primary bg-primary/10",
    category: "Armazenamento", subCategory: "M.2 NVMe Gen4", price: "R$ 1.199,00", discount: "-26% OFF",
    status: "Inativo", statusActive: false, icon: "storage",
  },
];

const AdminProducts = () => (
  <AdminLayout>
    <HeroBanner size="md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="mb-3">
            <Breadcrumb variant="light" items={[{ label: "Admin", to: "/admin" }, { label: "Dashboard", to: "/admin" }, { label: "Produtos" }]} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gerenciamento de Produtos</h1>
          <p className="text-blue-100/80 mt-2 font-light">Controle de estoque, preços e visibilidade da plataforma.</p>
        </div>
        <Link to="/admin/ofertas/nova" className="bg-white text-primary hover:bg-blue-50 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all transform hover:scale-[1.02] active:scale-95">
          <span className="material-symbols-outlined">add_circle</span>Adicionar Novo Produto
        </Link>
      </div>
    </HeroBanner>

    <main className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
      {/* Filters */}
      <div className="bg-card rounded-2xl shadow-xl border border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Buscar</label>
            <div className="relative">
              <input className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" placeholder="Nome ou SKU..." />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">search</span>
            </div>
          </div>
          {[
            { label: "Categoria", options: ["Todas", "Hardware", "Periféricos", "Mobile"] },
            { label: "Tipo de Peça", options: ["Todos", "GPU", "CPU", "RAM", "SSD"] },
            { label: "Marca", options: ["Todas", "NVIDIA", "Intel", "AMD", "ASUS"] },
            { label: "Status", options: ["Todos", "Ativo", "Inativo"] },
          ].map((filter) => (
            <div key={filter.label}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{filter.label}</label>
              <select className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2">
                {filter.options.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {["Produto", "Categoria", "Preço", "Status", "Ações"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider ${i === 4 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((prod) => (
                <tr key={prod.name} className={`hover:bg-muted/50 transition-colors ${!prod.statusActive ? "opacity-75" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 p-2 border border-border flex items-center justify-center text-muted-foreground">
                        <span className="material-symbols-outlined text-3xl">{prod.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-snug">{prod.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${prod.badgeColor}`}>{prod.badge}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-muted-foreground">{prod.category}</span>
                    <p className="text-[10px] text-muted-foreground">{prod.subCategory}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{prod.price}</span>
                      <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mt-1">{prod.discount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${prod.statusActive ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${prod.statusActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {[
                        { icon: "edit", hover: "hover:text-primary" },
                        { icon: "visibility", hover: "hover:text-foreground" },
                        { icon: "content_copy", hover: "hover:text-emerald-500" },
                        { icon: "delete", hover: "hover:text-destructive" },
                      ].map((action) => (
                        <button key={action.icon} className={`p-2 text-muted-foreground ${action.hover} transition-colors`}>
                          <span className="material-symbols-outlined text-xl">{action.icon}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          showInfo
          infoText='Exibindo <span class="font-bold">1-10</span> de <span class="font-bold">254</span> produtos'
          totalPages={25}
        />
      </div>
    </main>
  </AdminLayout>
);

export default AdminProducts;
