'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  brand: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Safe localStorage access for mobile
const isBrowser = typeof window !== 'undefined'

const getStoredCart = (): CartItem[] => {
  if (!isBrowser) return []
  
  try {
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return []
  }
}

const setStoredCart = (items: CartItem[]) => {
  if (!isBrowser) return
  
  try {
    localStorage.setItem('cart', JSON.stringify(items))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
    toast.error('Unable to save cart. Please check your browser settings.')
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate cart from localStorage only on client
  useEffect(() => {
    setItems(getStoredCart())
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever items change (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      setStoredCart(items)
    }
  }, [items, isHydrated])

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      
      if (existingItem) {
        toast.success('Item quantity updated in cart!')
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      toast.success('Item added to cart!')
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared')
  }

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Don't render until hydrated to avoid mismatch
  if (!isHydrated) {
    return <CartContext.Provider value={{
      items: [],
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getTotal: () => 0,
      itemCount: 0,
    }}>{children}</CartContext.Provider>
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}