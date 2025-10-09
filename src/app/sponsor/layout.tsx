
import SponsorSidebar from "@/components/sponsor-sidebar";

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
        <SponsorSidebar />
        <main className="flex-1 bg-secondary/30 overflow-y-auto">
            {children}
        </main>
    </div>
  );
}
