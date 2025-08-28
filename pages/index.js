import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, BarChart3, Users, FileText, Calendar } from "lucide-react";

// Importar componentes de gráficos
import OrdersChart from "@/components/charts/OrdersChart";
import BudgetsChart from "@/components/charts/BudgetsChart";
import JobsChart from "@/components/charts/JobsChart";
import ChecklistsChart from "@/components/charts/ChecklistsChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [data, setData] = useState({
    orders: [],
    budgets: [],
    jobs: [],
    checklists: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Realizar todas las peticiones en paralelo
      const [ordersRes, budgetsRes, jobsRes, checklistsRes] = await Promise.all(
        [
          fetch("/api/order/find"),
          fetch("/api/budget/find"),
          fetch("/api/job/find"),
          fetch("/api/checkList/find"),
        ]
      );

      // Verificar que todas las respuestas sean exitosas
      if (!ordersRes.ok || !budgetsRes.ok || !jobsRes.ok || !checklistsRes.ok) {
        throw new Error("Una o más peticiones fallaron");
      }

      const [ordersData, budgetsData, jobsData, checklistsData] =
        await Promise.all([
          ordersRes.json(),
          budgetsRes.json(),
          jobsRes.json(),
          checklistsRes.json(),
        ]);

      setData({
        orders: ordersData,
        budgets: budgetsData,
        jobs: jobsData,
        checklists: checklistsData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calcular estadísticas
  const stats = {
    orders: data.orders.length,
    budgets: data.budgets.length,
    jobs: data.jobs.length,
    checklists: data.checklists.length,
  };

  // Definir las pestañas
  const tabs = [
    { value: "overview", label: "Resumen" },
    { value: "orders", label: "Órdenes" },
    { value: "budgets", label: "Presupuestos" },
    { value: "jobs", label: "Tareas" },
    { value: "checklists", label: "Checklists" },
  ];

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-4 pt-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hola, <span className="text-primary">{session?.user?.name}</span>
          </h2>
          <div className="flex items-center space-x-2">
            {/* Podrías añadir un selector de rango de fechas aquí */}
          </div>
        </div>

        {/* Selector móvil */}
        {isMobile && (
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Seleccionar vista" />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Tabs para desktop */}
        {!isMobile && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Contenido de Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Tarjetas de resumen */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Órdenes
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.orders}</div>
                      <p className="text-xs text-muted-foreground">
                        Total de órdenes de trabajo
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Presupuestos
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.budgets}</div>
                      <p className="text-xs text-muted-foreground">
                        Total de presupuestos
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trabajos
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.jobs}</div>
                      <p className="text-xs text-muted-foreground">
                        Total de trabajos realizados
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Checklists
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.checklists}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total de checklists completados
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Contenido de Órdenes */}
            {activeTab === "orders" && (
              <Card>
                <CardContent className="p-4">
                  <OrdersChart orders={data.orders} />
                </CardContent>
              </Card>
            )}

            {/* Contenido de Presupuestos */}
            {activeTab === "budgets" && (
              <Card>
                <CardContent className="p-4">
                  <BudgetsChart budgets={data.budgets} />
                </CardContent>
              </Card>
            )}

            {/* Contenido de Tareas */}
            {activeTab === "jobs" && (
              <Card>
                <CardContent className="p-4">
                  <JobsChart jobs={data.jobs} />
                </CardContent>
              </Card>
            )}

            {/* Contenido de Checklists */}
            {activeTab === "checklists" && (
              <Card>
                <CardContent className="p-4">
                  <ChecklistsChart checklists={data.checklists} />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
