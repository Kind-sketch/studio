import ArtisanSidebar from '@/components/artisan-sidebar';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <ArtisanSidebar />
      <main className="flex-1 overflow-y-auto bg-secondary/30">{children}</main>
    </div>
  );
}
