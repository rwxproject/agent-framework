"use client";

import { CopilotChat } from "@copilotkit/react-ui";

export function ChatContainer() {
  return (
    <CopilotChat
      labels={{
        title: "Agent Framework",
        initial: "How can I help you today?",
      }}
      className="h-full"
    />
  );
}
