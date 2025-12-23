import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent Framework",
  description: "Build, deploy, and manage AI agent workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        <ThemeProvider>
          <CopilotKit runtimeUrl="/api/copilotkit" agent="orchestrator">
            {children}
          </CopilotKit>
        </ThemeProvider>
      </body>
    </html>
  );
}
