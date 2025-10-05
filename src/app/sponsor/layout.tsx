
import MainHeader from "@/components/main-header";
import SponsorSidebar from "@/components/sponsor-sidebar";

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <SponsorSidebar />
      <main className="flex-1 bg-secondary/30">
        <MainHeader />
        {children}
      </main>
    </div>
  );
}
