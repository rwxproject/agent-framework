import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("renders the header", () => {
    render(<Header />);
    expect(screen.getByText("Agent Framework")).toBeInTheDocument();
  });

  it("displays the version", () => {
    render(<Header />);
    expect(screen.getByText("v0.1.0")).toBeInTheDocument();
  });
});
