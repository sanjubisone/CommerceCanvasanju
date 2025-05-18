import CartClient from '@/components/cart/CartClient';

export const metadata = {
  title: 'Your Shopping Cart - CommerceCanvas',
  description: 'Review items in your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold text-primary">Your Shopping Cart</h1>
      </section>
      <CartClient />
    </div>
  );
}
