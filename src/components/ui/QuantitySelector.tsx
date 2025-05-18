'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  maxQuantity: number;
  minQuantity?: number;
}

const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity, minQuantity = 1 }: QuantitySelectorProps) => {
  
  const handleChange = (amount: number) => {
    const newQuantity = Math.max(minQuantity, Math.min(quantity + amount, maxQuantity));
    onQuantityChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) {
        onQuantityChange(minQuantity);
    } else {
        onQuantityChange(Math.max(minQuantity, Math.min(val, maxQuantity)));
    }
  };

  return (
    <div className="flex items-center border rounded-md">
      <Button variant="ghost" size="icon" onClick={() => handleChange(-1)} disabled={quantity <= minQuantity}>
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="w-16 h-10 text-center border-0 focus-visible:ring-0 hide-arrows"
        aria-label="Quantity"
        min={minQuantity}
        max={maxQuantity}
      />
      <Button variant="ghost" size="icon" onClick={() => handleChange(1)} disabled={quantity >= maxQuantity}>
        <Plus className="h-4 w-4" />
      </Button>
       <style jsx global>{`
        /* Hide number input arrows */
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default QuantitySelector;
