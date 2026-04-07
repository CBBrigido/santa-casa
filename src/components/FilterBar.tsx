import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export function FilterBar() {
  return (
    <div className="bg-card rounded-lg shadow-card p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground mr-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filtros</span>
      </div>
      <Select>
        <SelectTrigger className="w-[160px] h-9 text-xs">
          <SelectValue placeholder="Competência" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mar-2024">Mar/2024</SelectItem>
          <SelectItem value="fev-2024">Fev/2024</SelectItem>
          <SelectItem value="jan-2024">Jan/2024</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[160px] h-9 text-xs">
          <SelectValue placeholder="Convênio" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unimed">Unimed</SelectItem>
          <SelectItem value="sulamerica">SulAmérica</SelectItem>
          <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[140px] h-9 text-xs">
          <SelectValue placeholder="Tipo Prestador" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pf">PF</SelectItem>
          <SelectItem value="pj">PJ</SelectItem>
          <SelectItem value="clt">CLT</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[160px] h-9 text-xs">
          <SelectValue placeholder="Médico" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="silva">Dr. Silva</SelectItem>
          <SelectItem value="santos">Dra. Santos</SelectItem>
          <SelectItem value="oliveira">Dr. Oliveira</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[140px] h-9 text-xs">
          <SelectValue placeholder="Regra" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cbhpm">CBHPM</SelectItem>
          <SelectItem value="amb">AMB</SelectItem>
          <SelectItem value="contrato">Contrato</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[140px] h-9 text-xs">
          <SelectValue placeholder="Tipo Item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="proc">Procedimento</SelectItem>
          <SelectItem value="plantao">Plantão</SelectItem>
          <SelectItem value="prod">Produtividade</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
