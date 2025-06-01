'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function OrderFailureClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="text-center">
        <CardHeader>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-600">
            We're sorry, but your payment could not be processed.
          </p>
          {error && (
            <p className="text-sm text-red-500">
              Error: {error}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Please try again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/checkout">
            <Button variant="default">
              Try Again
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">
              Return to Shop
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}