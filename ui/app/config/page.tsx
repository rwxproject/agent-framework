"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ModelConfigPanel } from "@/components/config/ModelConfigPanel";
import { ThemeConfigPanel } from "@/components/config/ThemeConfigPanel";

export default function ConfigPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Configuration</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Model Settings</h2>
              <ModelConfigPanel />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
              <ThemeConfigPanel />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
