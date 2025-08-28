import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
const CHECK_COLORS = {
  'si': '#10b981',    // Sí - Verde
  'no': '#ef4444',    // No - Rojo
  'na': '#64748b',    // N/A - Gris
  'rep': '#f59e0b',   // Reparar - Naranja
  'unknown': '#94a3b8' // Desconocido - Gris claro
};

export default function ChecklistsChart({ checklists }) {
  const [viewType, setViewType] = useState('completionRate');
  const [timeRange, setTimeRange] = useState('monthly');

  // Procesar datos para el gráfico
  const processChecklistData = useMemo(() => {
    if (!checklists || checklists.length === 0) return [];

    // Filtrar por tiempo si es necesario
    let filteredChecklists = checklists;
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
        filteredChecklists = checklists.filter(checklist => {
          if (!checklist.dateCheckList) return false;
          const checklistDate = new Date(checklist.dateCheckList);
          return checklistDate >= cutoffDate;
        });
      }
    }

    // Procesar según el tipo de vista seleccionado
    if (viewType === 'completionRate') {
      const completionData = {};

      filteredChecklists.forEach(checklist => {
        if (!checklist.items || !Array.isArray(checklist.items)) return;

        const branch = checklist.branch || 'Sin sucursal';
        if (!completionData[branch]) {
          completionData[branch] = { name: branch, total: 0, completed: 0 };
        }

        checklist.items.forEach(item => {
          if (item.disabled === 'true') return; // Saltar items deshabilitados
          
          completionData[branch].total += 1;
          if (item.check === 'si') {
            completionData[branch].completed += 1;
          }
        });
      });

      // Calcular porcentaje de completitud
      return Object.values(completionData).map(item => ({
        ...item,
        completionRate: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0
      })).sort((a, b) => b.completionRate - a.completionRate).slice(0, 10); // Top 10
    }

    if (viewType === 'byCheckType') {
      const checkTypeData = {
        'si': { name: 'Sí', value: 0 },
        'no': { name: 'No', value: 0 },
        'na': { name: 'N/A', value: 0 },
        'rep': { name: 'Reparar', value: 0 }
      };

      filteredChecklists.forEach(checklist => {
        if (!checklist.items || !Array.isArray(checklist.items)) return;

        checklist.items.forEach(item => {
          if (item.disabled === 'true') return;
          
          const checkType = item.check || 'unknown';
          if (checkTypeData[checkType]) {
            checkTypeData[checkType].value += 1;
          }
        });
      });

      return Object.values(checkTypeData).filter(item => item.value > 0);
    }

    if (viewType === 'byEquipment') {
      const equipmentData = {};

      filteredChecklists.forEach(checklist => {
        const equipment = checklist.equipment || 'Sin equipo';
        if (!equipmentData[equipment]) {
          equipmentData[equipment] = { name: equipment, value: 0 };
        }
        equipmentData[equipment].value += 1;
      });

      return Object.values(equipmentData)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10 equipos
    }

    if (viewType === 'byTime') {
      const timeData = {};

      filteredChecklists.forEach(checklist => {
        if (!checklist.dateCheckList) return;
        
        const checklistDate = new Date(checklist.dateCheckList);
        const monthKey = `${checklistDate.getMonth() + 1}/${checklistDate.getFullYear()}`;

        if (!timeData[monthKey]) {
          timeData[monthKey] = { 
            name: monthKey, 
            value: 0,
            fullDate: checklistDate
          };
        }
        timeData[monthKey].value += 1;
      });

      // Ordenar por fecha
      return Object.values(timeData)
        .sort((a, b) => a.fullDate - b.fullDate)
        .map(item => ({ name: item.name, value: item.value }));
    }

    if (viewType === 'itemAnalysis') {
      // Análisis de items más problemáticos
      const itemData = {};

      filteredChecklists.forEach(checklist => {
        if (!checklist.items || !Array.isArray(checklist.items)) return;

        checklist.items.forEach(item => {
          if (item.disabled === 'true') return;
          
          const itemName = item.name || 'Sin nombre';
          if (!itemData[itemName]) {
            itemData[itemName] = { 
              name: itemName.length > 30 ? `${itemName.substring(0, 30)}...` : itemName,
              total: 0,
              si: 0,
              no: 0,
              na: 0,
              rep: 0
            };
          }

          itemData[itemName].total += 1;
          const checkType = item.check || 'unknown';
          if (itemData[itemName][checkType] !== undefined) {
            itemData[itemName][checkType] += 1;
          }
        });
      });

      // Calcular tasa de problemas (no + rep)
      return Object.values(itemData)
        .map(item => ({
          ...item,
          problemRate: item.total > 0 ? Math.round(((item.no + item.rep) / item.total) * 100) : 0
        }))
        .sort((a, b) => b.problemRate - a.problemRate)
        .slice(0, 10); // Top 10 items problemáticos
    }

    if (viewType === 'successRateRadar') {
      // Radar chart de tasa de éxito por categoría de items
      const categoryData = {};

      // Definir categorías (podrías ajustar esto según tus necesidades)
      const categories = {
        'DVR/NVR': ['dvr', 'nvr'],
        'Hardware': ['hardware', 'disco', 'hdd'],
        'Software': ['software'],
        'Cámaras': ['cámara', 'camara'],
        'UPS': ['ups'],
        'Monitor': ['monitor'],
        'Conectividad': ['red', 'network', 'conexión']
      };

      filteredChecklists.forEach(checklist => {
        if (!checklist.items || !Array.isArray(checklist.items)) return;

        checklist.items.forEach(item => {
          if (item.disabled === 'true') return;
          
          const itemName = item.name.toLowerCase();
          let category = 'Otros';

          // Encontrar la categoría del item
          for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => itemName.includes(keyword))) {
              category = cat;
              break;
            }
          }

          if (!categoryData[category]) {
            categoryData[category] = { category, total: 0, success: 0 };
          }

          categoryData[category].total += 1;
          if (item.check === 'si') {
            categoryData[category].success += 1;
          }
        });
      });

      // Calcular tasa de éxito
      return Object.values(categoryData).map(item => ({
        ...item,
        successRate: item.total > 0 ? Math.round((item.success / item.total) * 100) : 0,
        fullMark: 100
      }));
    }

    return [];
  }, [checklists, viewType, timeRange]);

  // Estadísticas generales
  const stats = useMemo(() => {
    if (!checklists || checklists.length === 0) {
      return {
        total: 0,
        totalItems: 0,
        completionRate: 0,
        itemsWithProblems: 0
      };
    }

    let totalItems = 0;
    let completedItems = 0;
    let problemItems = 0;

    checklists.forEach(checklist => {
      if (!checklist.items || !Array.isArray(checklist.items)) return;

      checklist.items.forEach(item => {
        if (item.disabled === 'true') return;
        
        totalItems += 1;
        if (item.check === 'si') completedItems += 1;
        if (item.check === 'no' || item.check === 'rep') problemItems += 1;
      });
    });

    return {
      total: checklists.length,
      totalItems,
      completedItems,
      problemItems,
      completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      problemRate: totalItems > 0 ? Math.round((problemItems / totalItems) * 100) : 0
    };
  }, [checklists]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Checklists</CardTitle>
          <CardDescription>
            {viewType === 'completionRate' ? 'Tasa de completitud por sucursal' :
             viewType === 'byCheckType' ? 'Distribución de respuestas' :
             viewType === 'byEquipment' ? 'Checklists por equipo' :
             viewType === 'byTime' ? 'Checklists por tiempo' :
             viewType === 'itemAnalysis' ? 'Items más problemáticos' :
             'Rendimiento por categoría'}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Tipo de vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completionRate">Completitud por Sucursal</SelectItem>
              <SelectItem value="byCheckType">Por Tipo de Respuesta</SelectItem>
              <SelectItem value="byEquipment">Por Equipo</SelectItem>
              <SelectItem value="byTime">Por Tiempo</SelectItem>
              <SelectItem value="itemAnalysis">Items Problemáticos</SelectItem>
              <SelectItem value="successRateRadar">Rendimiento por Categoría</SelectItem>
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
            <div className="text-sm text-muted-foreground">Total Checklists</div>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <div className="text-sm text-muted-foreground">Items verificados</div>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
              {stats.completionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Tasa de éxito</div>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>
              {stats.problemRate}%
            </div>
            <div className="text-sm text-muted-foreground">Tasa de problemas</div>
          </div>
        </div>

        <div className="h-[400px]">
          {processChecklistData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'successRateRadar' ? (
                // Radar chart para categorías
                <RadarChart data={processChecklistData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Tasa de éxito"
                    dataKey="successRate"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tasa de éxito']}
                  />
                </RadarChart>
              ) : viewType === 'completionRate' || viewType === 'byEquipment' || viewType === 'byTime' || viewType === 'itemAnalysis' ? (
                // Gráfico de barras
                <BarChart
                  data={processChecklistData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (viewType === 'completionRate') {
                        return [`${value}%`, 'Tasa de completitud'];
                      }
                      if (viewType === 'itemAnalysis') {
                        return [`${value}%`, 'Tasa de problemas'];
                      }
                      return [`${value}`, name === 'value' ? 'Cantidad' : name];
                    }}
                  />
                  <Bar
                    dataKey={viewType === 'completionRate' ? 'completionRate' : viewType === 'itemAnalysis' ? 'problemRate' : 'value'}
                    fill={viewType === 'completionRate' ? '#0ea5e9' : viewType === 'itemAnalysis' ? '#ef4444' : '#8884d8'}
                    name={viewType === 'completionRate' ? 'Tasa de completitud' : viewType === 'itemAnalysis' ? 'Tasa de problemas' : 'Cantidad'}
                  />
                </BarChart>
              ) : (
                // Gráfico de torta para tipos de respuesta
                <PieChart>
                  <Pie
                    data={processChecklistData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {processChecklistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHECK_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} respuestas`, 'Cantidad']}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No hay datos de checklists disponibles
            </div>
          )}
        </div>

        {/* Leyenda para colores */}
        {viewType === 'byCheckType' && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {processChecklistData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: CHECK_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length] }}
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