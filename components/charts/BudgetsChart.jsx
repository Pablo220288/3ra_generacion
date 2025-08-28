import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function BudgetsChart({ budgets }) {
  const [viewType, setViewType] = useState('monthly');
  const [currency, setCurrency] = useState('ars');

  // Procesar datos para el gráfico
  const processBudgetData = useMemo(() => {
    if (!budgets || budgets.length === 0) return [];

    // Datos para gráfico de barras (por tiempo)
    if (viewType === 'monthly' || viewType === 'quarterly') {
      const timeData = {};

      budgets.forEach(budget => {
        if (!budget.dateBudget) return;
        
        const budgetDate = new Date(budget.dateBudget);
        let groupKey;

        if (viewType === 'monthly') {
          // Agrupar por mes y año
          groupKey = `${budgetDate.getMonth() + 1}/${budgetDate.getFullYear()}`;
        } else {
          // Agrupar por trimestre y año
          const quarter = Math.floor(budgetDate.getMonth() / 3) + 1;
          groupKey = `T${quarter} ${budgetDate.getFullYear()}`;
        }

        if (!timeData[groupKey]) {
          timeData[groupKey] = { 
            name: groupKey,
            total: 0,
            count: 0,
            fullDate: budgetDate
          };
        }

        const amount = currency === 'ars' ? (budget.total || 0) : (budget.totalDollar || 0);
        timeData[groupKey].total += amount;
        timeData[groupKey].count += 1;
      });

      // Convertir a array y ordenar
      let result = Object.values(timeData).sort((a, b) => a.fullDate - b.fullDate);
      return result.map(item => ({
        name: item.name,
        total: Math.round(item.total),
        count: item.count
      }));
    }

    // Datos para gráfico de torta (por género/tipo)
    if (viewType === 'byGender') {
      const genderData = {};

      budgets.forEach(budget => {
        const gender = budget.gender || 'Sin especificar';
        const amount = currency === 'ars' ? (budget.total || 0) : (budget.totalDollar || 0);

        if (!genderData[gender]) {
          genderData[gender] = { 
            name: gender,
            value: 0,
            count: 0
          };
        }

        genderData[gender].value += amount;
        genderData[gender].count += 1;
      });

      return Object.values(genderData);
    }

    // Datos para gráfico de top items
    if (viewType === 'topItems') {
      const itemData = {};

      budgets.forEach(budget => {
        if (!budget.items || !Array.isArray(budget.items)) return;

        budget.items.forEach(item => {
          const itemName = item.name || 'Sin nombre';
          const itemTotal = item.total || 0;

          if (!itemData[itemName]) {
            itemData[itemName] = {
              name: itemName.length > 20 ? `${itemName.substring(0, 20)}...` : itemName,
              value: 0,
              count: 0
            };
          }

          itemData[itemName].value += itemTotal;
          itemData[itemName].count += 1;
        });
      });

      // Tomar solo los 10 items más frecuentes
      return Object.values(itemData)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }

    return [];
  }, [budgets, viewType, currency]);

  // Calcular totales generales
  const totals = useMemo(() => {
    if (!budgets || budgets.length === 0) return { totalARS: 0, totalUSD: 0, count: 0 };

    return budgets.reduce((acc, budget) => ({
      totalARS: acc.totalARS + (budget.total || 0),
      totalUSD: acc.totalUSD + (budget.totalDollar || 0),
      count: acc.count + 1
    }), { totalARS: 0, totalUSD: 0, count: 0 });
  }, [budgets]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Presupuestos</CardTitle>
          <CardDescription className="pt-2">
            Análisis de presupuestos por {viewType === 'byGender' ? 'tipo' : viewType === 'topItems' ? 'items' : 'tiempo'} y monto
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo de vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Por mes</SelectItem>
              <SelectItem value="quarterly">Por trimestre</SelectItem>
              <SelectItem value="byGender">Por tipo</SelectItem>
              <SelectItem value="topItems">Items más usados</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ars">ARS</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-2xl font-bold">{totals.count}</div>
            <div className="text-sm text-muted-foreground">Total presupuestos</div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-2xl font-bold">
              ${currency === 'ars' ? Math.round(totals.totalARS).toLocaleString() : Math.round(totals.totalUSD).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total {currency.toUpperCase()}</div>
          </div>
        </div>

        <div className="h-[400px]">
          {processBudgetData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'byGender' || viewType === 'topItems' ? (
                // Gráfico de torta para género y items
                <PieChart>
                  <Pie
                    data={processBudgetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {processBudgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [
                      `${currency === 'ars' ? '$' : 'USD '}${Math.round(value).toLocaleString()}`,
                      'Monto'
                    ]}
                  />
                </PieChart>
              ) : (
                // Gráfico de barras para tiempo
                <BarChart
                  data={processBudgetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${currency === 'ars' ? '$' : 'USD '}${Math.round(value).toLocaleString()}`,
                      'Monto total'
                    ]}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="#0ea5e9"
                    name={`Monto (${currency.toUpperCase()})`}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No hay datos de presupuestos disponibles
            </div>
          )}
        </div>

        {/* Información adicional */}
        {viewType !== 'topItems' && processBudgetData.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Promedio por presupuesto: {
              currency === 'ars' ? 
              `$${Math.round(processBudgetData.reduce((sum, item) => sum + item.total, 0) / processBudgetData.reduce((sum, item) => sum + item.count, 0)).toLocaleString()}` :
              `USD ${Math.round(processBudgetData.reduce((sum, item) => sum + item.total, 0) / processBudgetData.reduce((sum, item) => sum + item.count, 0)).toLocaleString()}`
            }</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}