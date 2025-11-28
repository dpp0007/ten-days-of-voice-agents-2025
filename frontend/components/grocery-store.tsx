'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X } from '@phosphor-icons/react';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  brand: string;
  image: string;
  tags: string[];
}

interface Category {
  name: string;
  items: Product[];
}

interface CartItem extends Product {
  quantity: number;
}

export function GroceryStore() {
  const [catalog, setCatalog] = useState<Record<string, Category>>({});
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => setCatalog(data.categories));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      if (existing) {
        return {
          ...prev,
          [product.id]: { ...existing, quantity: existing.quantity + 1 },
        };
      }
      return { ...prev, [product.id]: { ...product, quantity: 1 } };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      
      return {
        ...prev,
        [productId]: { ...item, quantity: newQuantity },
      };
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = () => {
    const order = {
      order_id: Math.random().toString(36).substr(2, 8),
      timestamp: new Date().toISOString(),
      customer: 'Guest',
      items: cartItems,
      total: cartTotal,
      status: 'placed',
    };
    
    console.log('Order placed:', order);
    setOrderId(order.order_id);
    setOrderPlaced(true);
    setCart({});
    setShowCart(false);
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">✓</div>
          <h2 className="mb-2 text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
          <p className="mb-4 text-gray-600">Order ID: {orderId}</p>
          <p className="mb-6 text-lg font-semibold">Total: ₹{cartTotal}</p>
          <button
            onClick={() => setOrderPlaced(false)}
            className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-green-600">QuickMart</h1>
            <p className="text-sm text-gray-500">Delivery in 8 minutes</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative rounded-lg bg-green-600 p-3 text-white hover:bg-green-700"
          >
            <ShoppingCart size={24} weight="fill" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {Object.entries(catalog).map(([key, category]) => (
          <div key={key} className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800">{category.name}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {category.items.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex h-32 items-center justify-center bg-gray-100 rounded">
                    <div className="text-4xl">🛒</div>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">{product.brand}</p>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                    {cart[product.id] ? (
                      <div className="flex items-center gap-2 rounded border border-green-600">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="px-2 py-1 text-green-600 hover:bg-green-50"
                        >
                          <Minus size={16} weight="bold" />
                        </button>
                        <span className="font-semibold text-green-600">{cart[product.id].quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="px-2 py-1 text-green-600 hover:bg-green-50"
                        >
                          <Plus size={16} weight="bold" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="rounded bg-green-600 px-4 py-1 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-bold">My Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} weight="bold" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="flex h-16 w-16 items-center justify-center bg-gray-100 rounded">
                          <span className="text-2xl">🛒</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.unit}</p>
                          <p className="font-semibold text-gray-800">₹{item.price}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} weight="bold" />
                          </button>
                          <div className="flex items-center gap-2 rounded border border-green-600">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2 py-1 text-green-600"
                            >
                              <Minus size={14} weight="bold" />
                            </button>
                            <span className="font-semibold text-green-600">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2 py-1 text-green-600"
                            >
                              <Plus size={14} weight="bold" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="mb-4 flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
