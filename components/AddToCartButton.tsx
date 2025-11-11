'use client'

import { useState } from 'react';
import { useCart } from '@/../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@prisma/client';

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add the item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        brand: product.brand,
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border rounded-md">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
        >
          -
        </button>
        <span className="px-4 font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </button>
    </div>
  );
}