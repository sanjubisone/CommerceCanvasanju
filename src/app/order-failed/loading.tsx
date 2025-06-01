import { Loader2 } from 'lucide-react';

export default function OrderFailedLoading() {
  return (
    <div className="container max-w-md mx-auto py-16 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}