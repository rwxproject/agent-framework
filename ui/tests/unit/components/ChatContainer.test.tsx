import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatContainer } from "@/components/chat/ChatContainer";

describe("ChatContainer", () => {
  it("renders the chat interface", () => {
    render(<ChatContainer />);
    expect(screen.getByTestId("copilot-chat")).toBeInTheDocument();
  });

  it("displays the correct title", () => {
    render(<ChatContainer />);
    expect(screen.getByText("Agent Framework")).toBeInTheDocument();
  });

  it("displays the initial message", () => {
    render(<ChatContainer />);
    expect(screen.getByText("How can I help you today?")).toBeInTheDocument();
  });
});
