import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata = {
  title: 'Checkout - CommerceCanvas',
  description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <section className="text-center py-8 bg-card rounded-lg shadow-sm mb-8">
        <h1 className="text-4xl font-bold text-primary">Checkout</h1>
        <p className="text-lg text-muted-foreground mt-2">Almost there! Please provide your details.</p>
      </section>
      <CheckoutClient />
    </div>
  );
}
