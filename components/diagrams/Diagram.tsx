import type { ChartId, DiagramId } from "@/lib/types";
import { FlowDiagram, bonaroSteps, fireEmsSteps } from "./FlowDiagram";
import { MakmexErd } from "./MakmexErd";
import { PricingScenarioChart } from "./PricingScenarioChart";

export function Diagram({ id }: { id: DiagramId }) {
  switch (id) {
    case "makmex-erd":
      return <MakmexErd />;
    case "fire-ems-pipeline":
      return <FlowDiagram steps={fireEmsSteps} label="Fire and EMS data pipeline" />;
    case "bonaro-architecture":
      return <FlowDiagram steps={bonaroSteps} label="Bonaro Tech lead-to-booking flow" />;
  }
}

export function Chart({ id }: { id: ChartId }) {
  switch (id) {
    case "pricing-scenarios":
      return <PricingScenarioChart />;
  }
}
