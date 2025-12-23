import { describe, it, expect } from "vitest";
import type { OrchestratorState } from "@/lib/state";

describe("OrchestratorState", () => {
  it("has the correct shape", () => {
    const state: OrchestratorState = {
      current_task: "test task",
      progress: 0.5,
      active_agents: ["orchestrator"],
      conversation_context: { topic: "testing" },
    };

    expect(state.current_task).toBe("test task");
    expect(state.progress).toBe(0.5);
    expect(state.active_agents).toContain("orchestrator");
    expect(state.conversation_context.topic).toBe("testing");
  });

  it("allows optional current_task", () => {
    const state: OrchestratorState = {
      progress: 0,
      active_agents: [],
      conversation_context: {},
    };

    expect(state.current_task).toBeUndefined();
  });
});
