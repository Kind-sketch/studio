import BuyerBottomNav from '@/components/buyer-bottom-nav';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BuyerBottomNav />
    </div>
  );
}
