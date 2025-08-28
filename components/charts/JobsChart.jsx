import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
const PRIORITY_COLORS = {
  1: '#ef4444', // Alta - Rojo
  2: '#f59e0b', // Media - Naranja
  3: '#10b981', // Baja - Verde
  4: '#64748b'  // Sin prioridad - Gris
};
const STATUS_COLORS = {
  'pending': '#f59e0b',    // Pendiente - Naranja
  'in_progress': '#0ea5e9', // En progreso - Azul
  'finish': '#10b981',     // Finalizado - Verde
  'cancelled': '#ef4444'   // Cancelado - Rojo
};

export default function JobsChart({ jobs }) {
  const [viewType, setViewType] = useState('byStatus');
  const [timeRange, setTimeRange] = useState('monthly');

  // Procesar datos para el gráfico
  const processJobData = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    // Filtrar por tiempo si es necesario
    let filteredJobs = jobs;
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (timeRange) {
        case 'monthly':
          cutoffDate = new Date();
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
        case 'quarterly':
          cutoffDate = new Date();
          cutoffDate.setMonth(cutoffDate.getMonth() - 3);
          break;
        case 'yearly':
          cutoffDate = new Date();
          cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate) {
        filteredJobs = jobs.filter(job => {
          if (!job.dateJob) return false;
          const jobDate = new Date(job.dateJob);
          return jobDate >= cutoffDate;
        });
      }
    }

    // Procesar según el tipo de vista seleccionado
    if (viewType === 'byStatus') {
      const statusData = {};

      filteredJobs.forEach(job => {
        const status = job.status || 'unknown';
        if (!statusData[status]) {
          statusData[status] = { name: status, value: 0 };
        }
        statusData[status].value += 1;
      });

      return Object.values(statusData);
    }

    if (viewType === 'byPriority') {
      const priorityData = {};

      filteredJobs.forEach(job => {
        const priority = job.priority || 4; // 4 = Sin prioridad
        if (!priorityData[priority]) {
          priorityData[priority] = { name: `Prioridad ${priority}`, value: 0, priority };
        }
        priorityData[priority].value += 1;
      });

      return Object.values(priorityData).sort((a, b) => a.priority - b.priority);
    }

    if (viewType === 'byGender') {
      const genderData = {};

      filteredJobs.forEach(job => {
        const gender = job.gender || 'Sin especificar';
        if (!genderData[gender]) {
          genderData[gender] = { name: gender, value: 0 };
        }
        genderData[gender].value += 1;
      });

      return Object.values(genderData);
    }

    if (viewType === 'byTime') {
      const timeData = {};

      filteredJobs.forEach(job => {
        if (!job.dateJob) return;
        
        const jobDate = new Date(job.dateJob);
        const monthKey = `${jobDate.getMonth() + 1}/${jobDate.getFullYear()}`;

        if (!timeData[monthKey]) {
          timeData[monthKey] = { 
            name: monthKey, 
            value: 0,
            fullDate: jobDate
          };
        }
        timeData[monthKey].value += 1;
      });

      // Ordenar por fecha
      return Object.values(timeData)
        .sort((a, b) => a.fullDate - b.fullDate)
        .map(item => ({ name: item.name, value: item.value }));
    }

    if (viewType === 'byOwner') {
      const ownerData = {};

      filteredJobs.forEach(job => {
        const ownerName = job.owner?.fullName || 'Sin asignar';
        if (!ownerData[ownerName]) {
          ownerData[ownerName] = { name: ownerName, value: 0 };
        }
        ownerData[ownerName].value += 1;
      });

      // Ordenar por cantidad descendente y tomar top 10
      return Object.values(ownerData)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }

    return [];
  }, [jobs, viewType, timeRange]);

  // Estadísticas generales
  const stats = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        total: 0,
        byStatus: {},
        byPriority: {},
        completed: 0,
        completionRate: 0
      };
    }

    const byStatus = {};
    const byPriority = {};
    let completed = 0;

    jobs.forEach(job => {
      // Por estado
      const status = job.status || 'unknown';
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Por prioridad
      const priority = job.priority || 4;
      byPriority[priority] = (byPriority[priority] || 0) + 1;

      // Completados
      if (status === 'finish') completed++;
    });

    return {
      total: jobs.length,
      byStatus,
      byPriority,
      completed,
      completionRate: jobs.length > 0 ? Math.round((completed / jobs.length) * 100) : 0
    };
  }, [jobs]);

  // Obtener color según el tipo de vista
  const getColor = (entry, index) => {
    if (viewType === 'byStatus') {
      return STATUS_COLORS[entry.name] || COLORS[index % COLORS.length];
    }
    if (viewType === 'byPriority') {
      return PRIORITY_COLORS[entry.priority] || COLORS[index % COLORS.length];
    }
    return COLORS[index % COLORS.length];
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="pb-2">Tareas</CardTitle>
          <CardDescription>
            Análisis de tareas por {viewType === 'byStatus' ? 'estado' : 
                                   viewType === 'byPriority' ? 'prioridad' : 
                                   viewType === 'byGender' ? 'tipo' : 
                                   viewType === 'byTime' ? 'tiempo' : 'responsable'}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo de vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="byStatus">Por Estado</SelectItem>
              <SelectItem value="byPriority">Por Prioridad</SelectItem>
              <SelectItem value="byGender">Por Tipo</SelectItem>
              <SelectItem value="byTime">Por Tiempo</SelectItem>
              <SelectItem value="byOwner">Por Responsable</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo</SelectItem>
              <SelectItem value="monthly">Último mes</SelectItem>
              <SelectItem value="quarterly">Último trimestre</SelectItem>
              <SelectItem value="yearly">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.finish }}>
              {stats.completed}
            </div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-sm text-muted-foreground">Tasa de éxito</div>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: PRIORITY_COLORS[1] }}>
              {stats.byPriority[1] || 0}
            </div>
            <div className="text-sm text-muted-foreground">Alta prioridad</div>
          </div>
        </div>

        <div className="h-[300px]">
          {processJobData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'byTime' || viewType === 'byOwner' ? (
                // Gráfico de barras para tiempo y responsables
                <BarChart
                  data={processJobData}
                  margin={{ top: 20, right: 30, left: 20, bottom: viewType === 'byOwner' ? 10 : 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={viewType === 'byOwner' ? -45 : 0} 
                    textAnchor="end" 
                    height={viewType === 'byOwner' ? 80 : 60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} trabajos`, 'Cantidad']}
                  />
                  <Bar
                    dataKey="value"
                    fill="#0ea5e9"
                    name="Trabajos"
                  />
                </BarChart>
              ) : (
                // Gráfico de torta para estado, prioridad y género
                <PieChart>
                  <Pie
                    data={processJobData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {processJobData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry, index)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} trabajos`, 'Cantidad']}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No hay datos de trabajos disponibles
            </div>
          )}
        </div>

        {/* Leyenda para colores */}
        {(viewType === 'byStatus' || viewType === 'byPriority') && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {processJobData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getColor(entry, index) }}
                />
                <span className="text-xs">{entry.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}