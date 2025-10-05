import SponsorSidebar from "@/components/sponsor-sidebar";

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SponsorSidebar />
      <main className="flex-1 bg-secondary/30">{children}</main>
    </div>
  );
}
