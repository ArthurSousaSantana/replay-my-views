import { Link } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFooter from "@/components/AdminFooter";
import HeroBanner from "@/components/HeroBanner";

const statsCards = [
  { label: "Total Produtos", value: "1,248", icon: "inventory_2", color: "bg-blue-100 text-blue-600" },
  { label: "Ofertas Ativas", value: "86", icon: "local_offer", color: "bg-emerald-100 text-emerald-600" },
  { label: "Builds Criadas", value: "342", icon: "memory", color: "bg-purple-100 text-purple-600" },
  { label: "Categorias", value: "24", icon: "category", color: "bg-orange-100 text-orange-600" },
  { label: "Marcas", value: "56", icon: "verified", color: "bg-pink-100 text-pink-600" },
];

const recentProducts = [
  { name: "iPhone 15 128GB", category: "Smartphones • Apple", price: "R$ 5.099,00", date: "Hoje, 14:30", icon: "smartphone" },
  { name: "Samsung 980 PRO NVMe", category: "Armazenamento • Samsung", price: "R$ 1.199,00", date: "Ontem, 09:15", icon: "storage" },
  { name: "GeForce RTX 4070 12GB", category: "Placas de Vídeo • NVIDIA", price: "R$ 4.049,00", date: "23 Out, 18:20", icon: "videogame_asset" },
  { name: "Teclado Mecânico Keychron K2", category: "Periféricos • Keychron", price: "R$ 759,00", date: "22 Out, 11:45", icon: "keyboard" },
];

const recentBuilds = [
  { name: 'O "1080p King" Starter', status: "ATIVO", statusColor: "bg-emerald-100 text-emerald-700", author: "Admin", date: "Há 2 horas" },
  { name: "1440p High Refresh Streamer", status: "DRAFT", statusColor: "bg-blue-100 text-blue-700", author: "Editor", date: "Ontem" },
  { name: "The 4K Monster", status: "ATIVO", statusColor: "bg-emerald-100 text-emerald-700", author: "Admin", date: "21 Out" },
];

const categoryData = [
  { label: "Hardware", color: "bg-blue-600", pct: "45%" },
  { label: "Periféricos", color: "bg-emerald-500", pct: "30%" },
  { label: "Laptops", color: "bg-amber-500", pct: "15%" },
  { label: "Outros", color: "bg-red-500", pct: "10%" },
];

const barData = [
  { label: "Entry", height: "40%", color: "bg-blue-500" },
  { label: "Mid-Range", height: "75%", color: "bg-indigo-500" },
  { label: "High-End", height: "55%", color: "bg-purple-500" },
  { label: "Workstation", height: "30%", color: "bg-pink-500" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <HeroBanner size="md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xl mb-2">
              Painel de Administração
            </h1>
            <p className="text-blue-100 font-light drop-shadow-md">
              Visão geral do desempenho e gerenciamento da plataforma.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/ofertas/nova"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-blue-400/30 ring-1 ring-blue-400/20 text-sm"
            >
              <span className="material-symbols-outlined text-lg">add_box</span>
              Novo Produto
            </Link>
            <Link
              to="/admin/builds/nova"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:border-white/40 text-sm"
            >
              <span className="material-symbols-outlined text-lg">computer</span>
              Nova Build
            </Link>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:border-white/40 text-sm">
              <span className="material-symbols-outlined text-lg">category</span>
              Nova Categoria
            </button>
          </div>
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-16 relative z-30">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statsCards.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-lg border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-1 space-y-8">
            {/* Donut Chart */}
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">pie_chart</span>
                Ofertas por Categoria
              </h3>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full mb-6 relative" style={{
                  background: "conic-gradient(hsl(var(--primary)) 0% 45%, hsl(var(--accent)) 45% 75%, #F59E0B 75% 90%, #EF4444 90% 100%)"
                }}>
                  <div className="w-[100px] h-[100px] bg-card rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-foreground">100%</span>
                    <span className="text-[10px] text-muted-foreground uppercase">Total</span>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  {categoryData.map((cat) => (
                    <div key={cat.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                        <span className="text-muted-foreground">{cat.label}</span>
                      </div>
                      <span className="font-semibold text-foreground">{cat.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Builds por Tipo
              </h3>
              <div className="flex items-end h-40 gap-3 pb-6 border-b border-border">
                {barData.map((bar) => (
                  <div key={bar.label} className={`flex-1 ${bar.color} rounded-t relative hover:opacity-80 transition-opacity`} style={{ height: bar.height }}>
                    <span className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">Distribuição de builds criadas por categoria de performance este mês.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Tables */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Products */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Últimos Produtos</h3>
                <Link to="/admin/produtos" className="text-sm text-primary hover:underline font-medium">Ver todos</Link>
              </div>
              <div className="divide-y divide-border">
                {recentProducts.map((prod) => (
                  <div key={prod.name} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 bg-card rounded border border-border flex items-center justify-center text-muted-foreground">
                      <span className="material-symbols-outlined text-2xl">{prod.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">{prod.name}</h4>
                      <p className="text-xs text-muted-foreground">{prod.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-foreground">{prod.price}</span>
                      <span className="text-xs text-muted-foreground">{prod.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Builds */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Últimas Builds</h3>
                <Link to="/admin/builds/nova" className="text-sm text-primary hover:underline font-medium">Ver todas</Link>
              </div>
              <div className="divide-y divide-border">
                {recentBuilds.map((build) => (
                  <div key={build.name} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-16 h-12 bg-muted rounded border border-border" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{build.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${build.statusColor}`}>
                          {build.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Criado por {build.author}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-medium text-muted-foreground">Atualizado</span>
                      <span className="text-xs text-muted-foreground">{build.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
