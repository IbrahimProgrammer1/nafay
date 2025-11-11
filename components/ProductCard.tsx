'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/../lib/utils';
import { useCart } from '@/../context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    images: string[];
    processor: string;
    ram: string;
    storage: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
    });
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md">
            <span className="text-xs font-semibold text-gray-700">{product.brand}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
            {product.name}
          </h3>
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <p className="truncate">{product.processor}</p>
            <p>{product.ram} RAM | {product.storage}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}