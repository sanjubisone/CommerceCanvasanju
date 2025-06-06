'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, User, Mail, MapPin, Landmark } from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Make sure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is defined in .env.local
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}

// Initialize Stripe outside component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  postalCode: z.string().min(3, { message: "Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Invalid card number (must be 16 digits)." }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Invalid expiry date (MM/YY)." }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "Invalid CVV (3 or 4 digits)." }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutClient = () => {

  const { clearCart, getCartTotal, cartItems } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema)
  });

  const cartTotal = getCartTotal();

  useEffect(() => {
    // Redirect if cart is empty, only on client-side
    if (typeof window !== 'undefined' && cartItems.length === 0) {
      router.push('/products');
    }
  }, [cartItems, router]);


  if (cartItems.length === 0) {
    // Render nothing or a loading state while redirecting
    return null; 
  }

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    try {
      setIsProcessing(true);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        throw result.error;
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Shipping & Payment</CardTitle>
        <CardDescription>Enter your details to complete the purchase. Total: <span className="font-bold text-primary">${cartTotal.toFixed(2)}</span></CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Shipping Information */}
          <fieldset className="space-y-4 border p-4 rounded-md">
            <legend className="text-lg font-medium text-foreground px-1">Shipping Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</Label>
                <Input id="fullName" {...register("fullName")} placeholder="John Doe" />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</Label>
                <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Street Address</Label>
              <Input id="address" {...register("address")} placeholder="123 Main St" />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} placeholder="Anytown" />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register("postalCode")} placeholder="12345" />
                {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} placeholder="United States" />
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
              </div>
            </div>
          </fieldset>

          {/* Payment Information */}
          <fieldset className="space-y-4 border p-4 rounded-md">
            <legend className="text-lg font-medium text-foreground px-1">Payment Details (Mock)</legend>
            <div>
              <Label htmlFor="cardNumber" className="flex items-center"><CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />Card Number</Label>
              <Input id="cardNumber" {...register("cardNumber")} placeholder="•••• •••• •••• ••••" />
              {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" {...register("expiryDate")} placeholder="MM/YY" />
                {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" {...register("cvv")} placeholder="123" />
                {errors.cvv && <p className="text-sm text-destructive mt-1">{errors.cvv.message}</p>}
              </div>
            </div>
          </fieldset>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Landmark className="mr-2 h-5 w-5 animate-pulse" /> Processing...
              </>
            ) : (
              <>
                <Landmark className="mr-2 h-5 w-5" /> Place Order (${cartTotal.toFixed(2)})
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CheckoutClient;
