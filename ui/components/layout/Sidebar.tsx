"use client";

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-gray-50 p-4">
      <nav className="space-y-2">
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
        >
          <span>Chat</span>
        </a>
        <a
          href="/config"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <span>Configuration</span>
        </a>
      </nav>
      {children}
    </aside>
  );
}
