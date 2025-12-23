import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";

describe("Sidebar", () => {
  it("renders the sidebar", () => {
    render(<Sidebar />);
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("renders configuration link", () => {
    render(<Sidebar />);
    expect(screen.getByText("Configuration")).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <Sidebar>
        <div data-testid="child">Child content</div>
      </Sidebar>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
