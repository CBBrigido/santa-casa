import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { FilterBar } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import { FinancialPipeline } from "@/components/FinancialPipeline";
import { BoxPlotChart } from "@/components/BoxPlotChart";
import { paymentEvolution, topDoctors, distributionByType, paymentRecords, statusDrilldown } from "@/data/mockData";

import { AlertTriangle } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function Dashboard() {
  const [boxPeriod, setBoxPeriod] = useState("todos");
  const [boxProvider, setBoxProvider] = useState("todos");
  const [boxProcedure, setBoxProcedure] = useState("todos");

  return (
    <AppLayout title="Dashboard Executivo">
      <div className="space-y-6 animate-fade-in">

        {/* Financial Pipeline */}
        <FinancialPipeline />

        {/* Filters */}
        <FilterBar />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Evolução de Pagamentos</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={paymentEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="value" name="Faturado" stroke="hsl(220 53% 45%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="paid" name="Pago" stroke="hsl(152 52% 42%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Top Prestadores por Valor</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topDoctors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" width={90} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" name="Valor" fill="hsl(220 53% 40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Box Plot Chart */}
        <div className="bg-card rounded-lg shadow-card p-5">
          <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">Distribuição de Valores por Procedimento</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Gráfico de Caixa (Box Plot) — variação e comparação entre prestadores por item
              </p>
            </div>
            {/* Filtros do Box Plot */}
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={boxPeriod} onValueChange={setBoxPeriod}>
                <SelectTrigger className="h-8 text-xs w-[130px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="abr26">Abr/2026</SelectItem>
                  <SelectItem value="mar26">Mar/2026</SelectItem>
                  <SelectItem value="fev26">Fev/2026</SelectItem>
                  <SelectItem value="jan26">Jan/2026</SelectItem>
                </SelectContent>
              </Select>
              <Select value={boxProvider} onValueChange={setBoxProvider}>
                <SelectTrigger className="h-8 text-xs w-[140px]">
                  <SelectValue placeholder="Prestador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos prestadores</SelectItem>
                  <SelectItem value="dr-silva">Dr. Silva</SelectItem>
                  <SelectItem value="dra-santos">Dra. Santos</SelectItem>
                  <SelectItem value="dr-oliveira">Dr. Oliveira</SelectItem>
                  <SelectItem value="dr-costa">Dr. Costa</SelectItem>
                  <SelectItem value="dra-lima">Dra. Lima</SelectItem>
                </SelectContent>
              </Select>
              <Select value={boxProcedure} onValueChange={setBoxProcedure}>
                <SelectTrigger className="h-8 text-xs w-[150px]">
                  <SelectValue placeholder="Procedimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="anestesia">Anestesia</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia Geral</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="ortopedia">Ortopedia</SelectItem>
                  <SelectItem value="uti">UTI</SelectItem>
                  <SelectItem value="radiologia">Radiologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <BoxPlotChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Distribuição por Tipo</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distributionByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={90} innerRadius={50}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distributionByType.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detalhamento por Status */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Detalhamento por Status</h3>
            <div className="grid grid-cols-4 gap-3 h-[232px]">
              {[
                { key: "pending",    label: "Valor Pendente",           color: "hsl(45 90% 50%)",  data: statusDrilldown.pending    },
                { key: "denied",     label: "Valor Glosado",            color: "hsl(0 72% 55%)",   data: statusDrilldown.denied     },
                { key: "processing", label: "Liberado para Pagamento",  color: "hsl(220 53% 45%)", data: statusDrilldown.processing },
                { key: "paid",       label: "Valor Faturado",           color: "hsl(145 60% 42%)", data: statusDrilldown.paid       },
              ].map(({ key, label, color, data }) => {
                const max = Math.max(...data.map(d => d.value));
                return (
                  <div key={key} className="flex flex-col min-h-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wide px-1 pb-1.5 border-b mb-1.5" style={{ color }}>
                      {label}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                      {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-muted-foreground truncate w-[88px] flex-shrink-0">{item.name}</span>
                          <div className="flex-1 h-3 rounded-sm overflow-hidden bg-muted">
                            <div
                              className="h-full rounded-sm"
                              style={{ width: `${(item.value / max) * 100}%`, background: color }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0 w-[34px] text-right">
                            {(item.value / 1000).toFixed(0)}k
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Table */}
        <div className="bg-card rounded-lg shadow-card">
          <div className="p-5 border-b">
            <h3 className="text-sm font-semibold text-card-foreground">Registros de Pagamento</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Data</TableHead>
                <TableHead className="text-xs">Médico</TableHead>
                <TableHead className="text-xs">Regra</TableHead>
                <TableHead className="text-xs text-right">Valor</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Alerta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentRecords.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="text-xs font-mono">{r.date}</TableCell>
                  <TableCell className="text-sm font-medium">{r.doctor}</TableCell>
                  <TableCell className="text-xs">{r.rule}</TableCell>
                  <TableCell className="text-sm font-mono text-right">{formatCurrency(r.amount)}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-xs">{r.type}</TableCell>
                  <TableCell>
                    {r.alert && (
                      <span className="inline-flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        {r.alert}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>
    </AppLayout>
  );
}
