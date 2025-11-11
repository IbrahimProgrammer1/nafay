'use client'

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '@/../components/ProductCard';
import Spinner from '@/../components/Spinner';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '@/../hooks/useDebounce';

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  brand: string;
  description: string;
  processor: string;
  ram: string;
  storage: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const [sort, order] = sortBy.split('-');
        const params = new URLSearchParams({
          sort,
          order,
        });

        if (debouncedSearchTerm) {
          params.append('search', debouncedSearchTerm);
        }
        if (selectedBrand !== 'all') {
          params.append('brand', selectedBrand);
        }
        
        const response = await axios.get(`/api/products?${params.toString()}`);
        const fetchedProducts: Product[] = response.data;
        setProducts(fetchedProducts);

        // Dynamically get brands from the fetched products
        const brands = Array.from(new Set(fetchedProducts.map(p => p.brand)));
        setAllBrands(brands);

      } catch (error) {
        console.error("Failed to fetch products", error);
        // Optionally, show a toast notification here
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [debouncedSearchTerm, selectedBrand, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Our Laptop Collection</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Find the perfect machine that fits your needs, from powerhouse gaming rigs to sleek ultrabooks.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 sticky top-20 z-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Brands</option>
                {allBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}