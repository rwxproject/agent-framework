"use client";

export function Header() {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)",
          }}
        >
          AF
        </div>
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Agent Framework
        </h1>
      </div>
      <nav className="flex items-center gap-4">
        <span
          className="text-sm px-2 py-1 rounded"
          style={{
            color: "var(--color-textSecondary)",
            backgroundColor: "var(--color-surfaceHover)",
          }}
        >
          v0.1.0
        </span>
      </nav>
    </header>
  );
}
