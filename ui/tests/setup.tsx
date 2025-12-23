import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock CopilotKit hooks
vi.mock("@copilotkit/react-core", () => ({
  CopilotKit: ({ children }: { children: React.ReactNode }) => children,
  useCoAgent: () => ({
    state: {
      current_task: null,
      progress: 0,
      active_agents: [],
      conversation_context: {},
    },
    setState: vi.fn(),
  }),
}));

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: ({ labels }: { labels: { title: string; initial: string } }) => (
    <div data-testid="copilot-chat">
      <h2>{labels.title}</h2>
      <p>{labels.initial}</p>
    </div>
  ),
}));
