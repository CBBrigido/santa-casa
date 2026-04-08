import { AppLayout } from "@/components/AppLayout";
import { KpiCard } from "@/components/KpiCard";
import { FilterBar } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import { kpiData, paymentEvolution, topDoctors, distributionByType, paymentRecords, statusDrilldown } from "@/data/mockData";

import { DollarSign, Clock, XCircle, CheckCircle, Receipt, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard Executivo">
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KpiCard title="Valor Pendente" value={kpiData.pendingAmount} icon={Clock} variant="pending" trend={{ value: 12, positive: false }} />
          <KpiCard title="Valor Glosado" value={kpiData.deniedAmount} icon={XCircle} variant="destructive" trend={{ value: 5, positive: false }} />
          <KpiCard title="Liberado s/ Repasse" value={kpiData.releasedNoPayment} icon={DollarSign} variant="muted" />
          <KpiCard title="Liberado c/ Repasse" value={kpiData.releasedWithPayment} icon={CheckCircle} variant="secondary" trend={{ value: 8, positive: true }} />
          <KpiCard title="Impostos" value={kpiData.taxes} icon={Receipt} variant="primary" />
        </div>

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

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Distribuição por Tipo</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={distributionByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
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
                { key: "pending",    label: "Pendente",         color: "hsl(45 90% 50%)",  data: statusDrilldown.pending    },
                { key: "denied",     label: "Glosado",          color: "hsl(0 72% 55%)",   data: statusDrilldown.denied     },
                { key: "processing", label: "Em Processamento", color: "hsl(220 53% 45%)", data: statusDrilldown.processing },
                { key: "paid",       label: "Pago",             color: "hsl(145 60% 42%)", data: statusDrilldown.paid       },
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
