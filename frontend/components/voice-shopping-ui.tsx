'use client';

import { useState, useEffect } from 'react';
import { RoomAudioRenderer, useVoiceAssistant, BarVisualizer, useRoomContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionProvider } from '@/components/app/session-provider';
import { Toaster } from '@/components/livekit/toaster';
import { ShoppingCart, Plus, Minus, X, Microphone, MicrophoneSlash } from '@phosphor-icons/react';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  brand: string;
  tags: string[];
}

interface Category {
  name: string;
  items: Product[];
}

interface CartItem extends Product {
  quantity: number;
}

interface VoiceShoppingUIProps {
  appConfig: AppConfig;
}

function VoiceShoppingContent() {
  const [catalog, setCatalog] = useState<Record<string, Category>>({});
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [showCart, setShowCart] = useState(true);
  const { state, audioTrack } = useVoiceAssistant();
  const room = useRoomContext();

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

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isConnected = room?.state === 'connected';

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-green-600">QuickMart Voice</h1>
            <div className="hidden md:block text-sm text-gray-500">Voice Shopping Assistant</div>
          </div>

          {/* Voice Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  {isListening && (
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-600"></div>
                      <span className="text-xs font-medium text-green-700">Listening</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5">
                      <BarVisualizer
                        state={state}
                        barCount={5}
                        trackRef={audioTrack}
                        className="h-4 w-16"
                        options={{ minHeight: 4 }}
                      />
                      <span className="text-xs font-medium text-blue-700">Speaking</span>
                    </div>
                  )}
                  {!isListening && !isSpeaking && (
                    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
                      <Microphone size={16} className="text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">Ready</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-600"></div>
                  <span className="text-xs font-medium text-yellow-700">Connecting...</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative rounded-lg bg-green-600 p-2.5 text-white hover:bg-green-700"
            >
              <ShoppingCart size={24} weight="fill" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Products Grid */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-6xl">
            {Object.entries(catalog).map(([key, category]) => (
              <div key={key} className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-gray-800">{category.name}</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {category.items.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-3 flex h-32 items-center justify-center rounded bg-gray-100">
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
          </div>
        </main>

        {/* Cart Sidebar */}
        {showCart && (
          <aside className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">My Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
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
              <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700">
                  Place Order
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Voice Commands Help */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Microphone size={16} weight="fill" />
              <span className="font-medium">Try saying:</span>
              <span className="text-gray-500">"Add milk" • "Ingredients for pasta" • "What's in my cart?" • "Place order"</span>
            </div>
            <div className="text-xs text-gray-400">Powered by Murf Falcon TTS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VoiceShoppingUI({ appConfig }: VoiceShoppingUIProps) {
  return (
    <SessionProvider appConfig={appConfig}>
      <VoiceShoppingContent />
      <RoomAudioRenderer />
      <Toaster />
    </SessionProvider>
  );
}
