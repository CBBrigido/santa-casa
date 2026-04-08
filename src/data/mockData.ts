// Mock data for the Medical Fee Management System

export const statusDrilldown = {
  pending: [
    { name: "Clínica Alpha",        value: 48200 },
    { name: "Centro Médico Beta",   value: 38500 },
    { name: "Hospital Gama",        value: 27100 },
    { name: "Serv. Médicos Delta",  value: 21400 },
    { name: "Inst. Saúde Épsilon",  value: 18900 },
    { name: "Clínica Zeta",         value: 15300 },
    { name: "Grupo Médico Eta",     value: 12800 },
    { name: "Serv. Clínicos Teta",  value:  9600 },
  ],
  denied: [
    { name: "Anestesia Iota",       value: 14200 },
    { name: "Centro Cirúr. Capa",   value: 10800 },
    { name: "Clínica Lambda",       value:  8500 },
    { name: "Serv. Médicos Mi",     value:  7200 },
    { name: "Inst. Diagnós. Ni",    value:  5900 },
    { name: "Grupo Saúde Xi",       value:  4300 },
    { name: "Clínica Ômicron",      value:  3800 },
    { name: "Centro Médico Pi",     value:  2900 },
  ],
  processing: [
    { name: "Hospital Rô",          value: 52400 },
    { name: "Clínica Sigma",        value: 41200 },
    { name: "Serv. Médicos Tau",    value: 29800 },
    { name: "Instituto Ipsilon",    value: 22100 },
    { name: "Centro Médico Fi",     value: 18700 },
    { name: "Clínica Qui",          value: 15400 },
    { name: "Grupo Médico Psi",     value: 12300 },
    { name: "Serv. Clínicos Ômega", value:  9800 },
  ],
  paid: [
    { name: "Dr. A. Souza",         value: 89500 },
    { name: "Dra. B. Pereira",      value: 76200 },
    { name: "Dr. C. Mendes",        value: 68900 },
    { name: "Dra. D. Rocha",        value: 54300 },
    { name: "Dr. E. Cardoso",       value: 48700 },
    { name: "Dra. F. Martins",      value: 42100 },
    { name: "Dr. G. Barbosa",       value: 35600 },
    { name: "Dra. H. Carvalho",     value: 28400 },
  ],
};

export const kpiData = {
  pendingAmount: 284750.00,
  deniedAmount: 42380.50,
  releasedNoPayment: 156420.00,
  releasedWithPayment: 892340.75,
  taxes: 178468.15,
};

export const paymentEvolution = [
  { month: "Jan/26", value: 145000, paid: 120000 },
  { month: "Fev/26", value: 162000, paid: 155000 },
  { month: "Mar/26", value: 178000, paid: 168000 },
  { month: "Abr/26", value: 195000, paid: 180000 },
];

export const topDoctors = [
  { name: "Dr. Silva", value: 89500 },
  { name: "Dra. Santos", value: 76200 },
  { name: "Dr. Oliveira", value: 68900 },
  { name: "Dr. Costa", value: 54300 },
  { name: "Dra. Lima", value: 48700 },
  { name: "Dr. Ferreira", value: 42100 },
];

export const distributionByType = [
  { name: "Procedimentos", value: 62, fill: "hsl(210 70% 50%)" },
  { name: "Materiais", value: 23, fill: "hsl(160 50% 45%)" },
  { name: "Medicamentos", value: 15, fill: "hsl(45 85% 55%)" },
];

export const taxesBreakdown = [
  { month: "Jan/26", iss: 8200, irrf: 12500, inss: 6800, pis: 2100 },
  { month: "Fev/26", iss: 9100, irrf: 13200, inss: 7200, pis: 2300 },
  { month: "Mar/26", iss: 9800, irrf: 14100, inss: 7800, pis: 2500 },
  { month: "Abr/26", iss: 10500, irrf: 15000, inss: 8200, pis: 2700 },
];

export const paymentRecords = [
  { id: 1, date: "2026-04-05", doctor: "Dr. Silva",    rule: "Tabela CBHPM", amount: 12500.00, status: "paid",       type: "Procedimento", alert: null },
  { id: 2, date: "2026-04-04", doctor: "Dra. Santos",  rule: "Contrato PJ",  amount: 8750.00,  status: "pending",    type: "Plantão",      alert: null },
  { id: 3, date: "2026-04-04", doctor: "Dr. Oliveira", rule: "Tabela AMB",   amount: 4200.00,  status: "denied",     type: "Procedimento", alert: "Glosa por inconsistência" },
  { id: 4, date: "2026-04-03", doctor: "Dr. Costa",    rule: "Produtividade",amount: 15800.00, status: "processing", type: "Produtividade",alert: null },
  { id: 5, date: "2026-04-03", doctor: "Dra. Lima",    rule: "Tabela CBHPM", amount: 6300.00,  status: "paid",       type: "Procedimento", alert: null },
  { id: 6, date: "2026-04-02", doctor: "Dr. Ferreira", rule: "CLT",          amount: 22000.00, status: "paid",       type: "Plantão",      alert: null },
  { id: 7, date: "2026-04-02", doctor: "Dr. Silva",    rule: "Avulso",       amount: 3200.00,  status: "pending",    type: "Procedimento", alert: "Item avulso - verificar" },
  { id: 8, date: "2026-04-01", doctor: "Dra. Santos",  rule: "Contrato PJ",  amount: 9100.00,  status: "review",     type: "Plantão",      alert: "Regra incorreta aplicada" },
];

export type KanbanCard = {
  id: number;
  doctor: string;
  amount: number;
  items: number;
  alert?: string;
  priority: "low" | "medium" | "high";
};

export const kanbanColumns = [
  {
    id: "processing",
    title: "Em Processamento",
    color: "processing" as const,
    cards: [
      { id: 1, doctor: "Dr. Costa", amount: 15800, items: 3, priority: "medium" as const },
      { id: 2, doctor: "Dra. Ribeiro", amount: 8400, items: 2, priority: "low" as const },
    ],
  },
  {
    id: "billed",
    title: "Faturado",
    color: "processing" as const,
    cards: [
      { id: 3, doctor: "Dr. Silva", amount: 22500, items: 5, alert: "Item avulso", priority: "high" as const },
      { id: 4, doctor: "Dr. Almeida", amount: 11200, items: 2, priority: "low" as const },
    ],
  },
  {
    id: "validation",
    title: "Em Validação",
    color: "pending" as const,
    cards: [
      { id: 5, doctor: "Dra. Santos", amount: 9100, items: 4, alert: "Regra incorreta", priority: "high" as const },
    ],
  },
  {
    id: "waiting-invoice",
    title: "Aguardando NF",
    color: "pending" as const,
    cards: [
      { id: 6, doctor: "Dr. Oliveira", amount: 18700, items: 6, priority: "medium" as const },
      { id: 7, doctor: "Dra. Lima", amount: 6300, items: 1, priority: "low" as const },
    ],
  },
  {
    id: "ready",
    title: "Pronto p/ Pagamento",
    color: "ok" as const,
    cards: [
      { id: 8, doctor: "Dr. Ferreira", amount: 42100, items: 8, priority: "low" as const },
    ],
  },
  {
    id: "paid",
    title: "Pago",
    color: "ok" as const,
    cards: [
      { id: 9, doctor: "Dr. Silva", amount: 12500, items: 3, priority: "low" as const },
      { id: 10, doctor: "Dra. Lima", amount: 6300, items: 1, priority: "low" as const },
    ],
  },
  {
    id: "review",
    title: "Em Revisão",
    color: "issue" as const,
    cards: [
      { id: 11, doctor: "Dra. Santos", amount: 8750, items: 2, alert: "Contestação aberta", priority: "high" as const },
    ],
  },
];

export const doctorPortalData = {
  name: "Dr. Carlos Silva",
  crm: "CRM/SP 123456",
  specialty: "Cirurgia Geral",
  expectedEarnings: 45200.00,
  confirmedEarnings: 38750.00,
  pendingInvoices: 3,
  totalPaid: 412800.00,
  timeline: [
    { date: "2026-04-05", event: "Pagamento liberado",    amount: 12500, status: "ok" as const },
    { date: "2026-04-01", event: "NF aprovada",           amount: 8200,  status: "ok" as const },
    { date: "2026-03-25", event: "Aguardando validação",  amount: 15800, status: "pending" as const },
    { date: "2026-03-15", event: "Glosa identificada",    amount: 3200,  status: "issue" as const },
    { date: "2026-03-05", event: "Pagamento realizado",   amount: 22000, status: "ok" as const },
    { date: "2026-02-28", event: "Em processamento",      amount: 9400,  status: "processing" as const },
  ],
  paymentHistory: [
    { period: "Abr/2026", gross: 45200, taxes: 9040, net: 36160, status: "partial" },
    { period: "Mar/2026", gross: 52800, taxes: 10560, net: 42240, status: "paid" },
    { period: "Fev/2026", gross: 48500, taxes: 9700,  net: 38800, status: "paid" },
    { period: "Jan/2026", gross: 55200, taxes: 11040, net: 44160, status: "paid" },
    { period: "Dez/2025", gross: 42100, taxes: 8420,  net: 33680, status: "paid" },
  ],
  pendingInvoicesList: [
    { id: 1, period: "01-15 Abr/2026", amount: 12500, dueDate: "2026-04-25", status: "waiting" },
    { id: 2, period: "16-31 Mar/2026", amount: 8200,  dueDate: "2026-04-05", status: "overdue" },
    { id: 3, period: "01-05 Abr/2026", amount: 15800, dueDate: "2026-04-30", status: "waiting" },
  ],
};
