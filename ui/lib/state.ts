export interface OrchestratorState {
  current_task?: string;
  progress: number;
  active_agents: string[];
  conversation_context: Record<string, unknown>;
}
