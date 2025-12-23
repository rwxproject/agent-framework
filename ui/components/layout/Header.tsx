"use client";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
        <h1 className="text-xl font-semibold">Agent Framework</h1>
      </div>
      <nav className="flex items-center gap-4">
        <span className="text-sm text-gray-500">v0.1.0</span>
      </nav>
    </header>
  );
}
