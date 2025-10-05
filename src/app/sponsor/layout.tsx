
import MainHeader from "@/components/main-header";
import SponsorSidebar from "@/components/sponsor-sidebar";

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <SponsorSidebar />
      <main className="flex-1 bg-secondary/30 overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          {/* This space is for the sidebar trigger on mobile */}
        </header>
        {children}
      </main>
    </div>
  );
}
