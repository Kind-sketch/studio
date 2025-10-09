
"use client";

import MainHeader from "@/components/main-header";
import SponsorSidebar from "@/components/sponsor-sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useState } from "react";

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDesktopAside, setShowDesktopAside] = useState(false);
  return (
    <div className="flex h-full flex-col md:flex-row">
      <SponsorSidebar showDesktopAside={showDesktopAside} />
      <main className="flex-1 bg-secondary/30 overflow-visible md:overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Desktop toggle for collapsing/expanding sidebar */}
          <div className="hidden md:block">
            <Button variant="outline" size="icon" onClick={() => setShowDesktopAside((v) => !v)} aria-label="Toggle sidebar">
              <PanelLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="ml-auto">
            <MainHeader />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
