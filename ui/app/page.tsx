"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
}
