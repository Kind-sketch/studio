export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-secondary/30">{children}</div>;
}
