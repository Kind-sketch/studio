import BuyerBottomNav from '@/components/buyer-bottom-nav';
import MainHeader from '@/components/main-header';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BuyerBottomNav />
    </div>
  );
}
