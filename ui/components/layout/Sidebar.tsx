"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  children?: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Chat", icon: "💬" },
  { href: "/config", label: "Configuration", icon: "⚙️" },
];

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 border-r p-4 flex flex-col"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "" : "hover:opacity-80"
              }`}
              style={{
                backgroundColor: isActive
                  ? "var(--color-primary)"
                  : "transparent",
                color: isActive ? "#ffffff" : "var(--color-text)",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {children}
      <div
        className="pt-4 mt-4 border-t text-xs"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-textSecondary)",
        }}
      >
        Agent Framework v0.1.0
      </div>
    </aside>
  );
}
