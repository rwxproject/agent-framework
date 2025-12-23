"use client";

import { useCoAgent } from "@copilotkit/react-core";
import type { OrchestratorState } from "@/lib/state";

export function useAgentState() {
  return useCoAgent<OrchestratorState>({
    name: "orchestrator",
  });
}
