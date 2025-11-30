'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRoomContext, useVoiceAssistant, useChat } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import styles from './commerce-session.module.css';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

interface CommerceSessionProps {
  appConfig: AppConfig;
  onEndSession?: () => void;
}

export const CommerceSessionView = ({
  appConfig,
  onEndSession: endSessionProp,
  ...props
}: React.ComponentProps<'section'> & CommerceSessionProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const { state } = useVoiceAssistant();
  const room = useRoomContext();
  const chat = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [productResults, setProductResults] = useState<Record<string, any[]>>({});
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [orderConfirmation, setOrderConfirmation] = useState<any>(null);
  const [cart, setCart] = useState<any>({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  const isAgentSpeaking = state === 'speaking';
  const isListening = state === 'listening';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, productResults]);

  // Listen for data messages from backend
  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const message = new TextDecoder().decode(payload);
        console.log('📥 Received data message:', message);
        const data = JSON.parse(message);
        console.log('📦 Parsed data:', data);
        console.log('📦 Data type:', data.type);

        if (data.type === 'product_list' && data.products) {
          console.log('✅ Product list received:', data.products);
          // Store products with timestamp as key for next message
          const timestamp = data.timestamp || Date.now().toString();
          setLatestProducts(data.products);
          setProductResults((prev) => ({
            ...prev,
            [timestamp]: data.products,
          }));
          console.log('📊 Stored products with timestamp:', timestamp);
        } else if (data.type === 'order_confirmation') {
          console.log('✅ Order confirmation received:', data);
          setOrderConfirmation(data);
          // Clear products after order
          setLatestProducts([]);
        } else if (data.type === 'cart_update') {
          console.log('🛒 Cart update received:', data.cart);
          setCart(data.cart);
        } else if (data.type === 'order_history') {
          console.log('📜 Order history received:', data.orders);
          setOrderHistory(data.orders);
        }
      } catch (error) {
        console.error('❌ Error parsing data message:', error);
      }
    };

    room.on('dataReceived', handleDataReceived);

    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room]);

  // Toggle mic mute
  const handleMicToggle = async () => {
    try {
      const currentMuted = room.localParticipant.isMicrophoneEnabled === false;
      await room.localParticipant.setMicrophoneEnabled(currentMuted);
      setIsMuted(!currentMuted);
    } catch (error) {
      console.error('Error toggling mic:', error);
    }
  };

  // Handle text input send
  const handleSendText = async () => {
    if (!textInput.trim()) return;

    try {
      // Send text message via LiveKit chat
      await chat.send(textInput);
      setTextInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle buy product
  const handleBuyProduct = async (product: any) => {
    try {
      // Send structured command with product details
      const command = `Add ${product.name} to my cart`;
      await chat.send(command);
      console.log('🛒 Added to cart:', product.id, product.name);
    } catch (error) {
      console.error('Error buying product:', error);
    }
  };

  // Handle back button
  const handleBack = async () => {
    try {
      if (room.state !== 'disconnected') {
        await room.disconnect();
      }
      if (endSessionProp) {
        endSessionProp();
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return (
    <section className={styles.container} {...props}>
      {/* Gradient Background */}
      <div className={styles.background} />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack} aria-label="Back">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className={styles.headerTitle}>
            <h1>AI Shopping Assistant</h1>
            <div className={styles.statusIndicator}>
              <div
                className={`${styles.statusDot} ${isListening ? styles.listening : isAgentSpeaking ? styles.speaking : ''}`}
              />
              <span>
                {isListening ? 'Listening...' : isAgentSpeaking ? 'Speaking...' : 'Ready'}
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* Cart Button */}
            <button
              className={styles.cartButton}
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Shopping cart"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cart.items.length > 0 && (
                <span className={styles.cartBadge}>
                  {cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className={styles.cartDrawer}>
            <div className={styles.cartHeader}>
              <h2>Shopping Cart</h2>
              <button
                className={styles.cartCloseButton}
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            <div className={styles.cartContent}>
              {cart.items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <div className={styles.emptyCartIcon}>🛒</div>
                  <p>Your cart is empty</p>
                  <button
                    className={styles.continueShoppingButton}
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.items.map((item: any, index: number) => (
                      <div key={`${item.product_id}-${index}`} className={styles.cartItem}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className={styles.cartItemImage}
                        />
                        <div className={styles.cartItemDetails}>
                          <h4 className={styles.cartItemName}>{item.name}</h4>
                          {item.color && (
                            <p className={styles.cartItemVariant}>Color: {item.color}</p>
                          )}
                          {item.size && (
                            <p className={styles.cartItemVariant}>Size: {item.size}</p>
                          )}
                          <div className={styles.cartItemPrice}>
                            ${item.unit_price} × {item.quantity}
                          </div>
                        </div>
                        <button
                          className={styles.removeButton}
                          onClick={() => chat.send(`Remove ${item.name} from cart`)}
                          aria-label="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartFooter}>
                    <div className={styles.cartTotal}>
                      <span>Total:</span>
                      <span className={styles.cartTotalAmount}>${cart.total.toFixed(2)}</span>
                    </div>
                    <button
                      className={styles.checkoutButton}
                      onClick={() => {
                        chat.send('Checkout');
                        setIsCartOpen(false);
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Cart Overlay */}
        {isCartOpen && <div className={styles.cartOverlay} onClick={() => setIsCartOpen(false)} />}

        {/* Chat Messages Area */}
        <div className={styles.chatContainer}>
          <div className={styles.messagesWrapper}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛍️</div>
                <h2>Welcome to AI Shopping</h2>
                <p>Start speaking or typing to browse products and place orders</p>
              </div>
            )}

            {messages.map((msg, index) => {
              const isUser = msg.from?.identity === room.localParticipant.identity;
              
              // Check if this is the last agent message and we have products
              const isLastAgentMessage = !isUser && index === messages.length - 1;
              const shouldShowProducts = isLastAgentMessage && latestProducts.length > 0;
              const products = shouldShowProducts ? latestProducts : [];
              
              // Check if this message is an order confirmation
              const isOrderConfirmation = !isUser && msg.message.toLowerCase().includes('order') && 
                                         msg.message.toLowerCase().includes('confirmed');
              const showOrderCard = isOrderConfirmation && orderConfirmation && isLastAgentMessage;
              
              // Check if this message is about order history
              const isOrderHistory = !isUser && (
                msg.message.toLowerCase().includes('last order') ||
                msg.message.toLowerCase().includes('orders today') ||
                msg.message.toLowerCase().includes('you have') && msg.message.toLowerCase().includes('order')
              );
              const showOrderHistory = isOrderHistory && orderHistory.length > 0 && isLastAgentMessage;

              return (
                <React.Fragment key={`${msg.timestamp}-${index}`}>
                  <div
                    className={`${styles.messageRow} ${isUser ? styles.userRow : styles.agentRow}`}
                  >
                    <div className={styles.messageAvatar}>{isUser ? '👤' : '🤖'}</div>
                    <div className={styles.messageBubble}>
                      <div className={styles.messageText}>{msg.message}</div>
                      <div className={styles.messageTime}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  {!isUser && isLastAgentMessage && (
                    <>
                      {showOrderCard && orderConfirmation && (
                        <div className={styles.orderConfirmationCard}>
                          <div className={styles.orderHeader}>
                            <div className={styles.orderIcon}>✅</div>
                            <h3 className={styles.orderTitle}>Order Confirmed!</h3>
                          </div>
                          <div className={styles.orderDetails}>
                            <div className={styles.orderRow}>
                              <span className={styles.orderLabel}>Order ID:</span>
                              <span className={styles.orderValue}>{orderConfirmation.order_id}</span>
                            </div>
                            <div className={styles.orderRow}>
                              <span className={styles.orderLabel}>Total:</span>
                              <span className={styles.orderValue}>${orderConfirmation.total}</span>
                            </div>
                            <div className={styles.orderRow}>
                              <span className={styles.orderLabel}>Status:</span>
                              <span className={styles.orderStatus}>Confirmed</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {showOrderHistory && (
                        <div className={styles.orderHistoryContainer}>
                          {orderHistory.map((order, idx) => (
                            <div key={order.order_id} className={styles.orderHistoryCard}>
                              <div className={styles.orderHistoryHeader}>
                                <div className={styles.orderHistoryId}>{order.order_id}</div>
                                <div className={styles.orderHistoryDate}>
                                  {new Date(order.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                              <div className={styles.orderHistoryItems}>
                                {order.items.map((item: any, itemIdx: number) => (
                                  <div key={itemIdx} className={styles.orderHistoryItem}>
                                    <span className={styles.orderHistoryItemName}>
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className={styles.orderHistoryItemPrice}>
                                      ${(item.unit_price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className={styles.orderHistoryFooter}>
                                <span className={styles.orderHistoryStatus}>
                                  {order.status || 'Confirmed'}
                                </span>
                                <span className={styles.orderHistoryTotal}>
                                  Total: ${order.total.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {products.length > 0 ? (
                        <div className={styles.productCardsContainer}>
                          {products.map((product) => (
                            <div key={product.id} className={styles.productCard}>
                              <div className={styles.productImage}>
                                <img src={product.image} alt={product.name} />
                              </div>
                              <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productDescription}>{product.description}</p>
                                <div className={styles.productPrice}>${product.price}</div>
                                {product.colors && product.colors.length > 0 && (
                                  <div className={styles.productAttributes}>
                                    <span className={styles.attributeLabel}>Colors:</span>
                                    <span className={styles.attributeValue}>
                                      {product.colors.join(', ')}
                                    </span>
                                  </div>
                                )}
                                {product.sizes && product.sizes.length > 0 && (
                                  <div className={styles.productAttributes}>
                                    <span className={styles.attributeLabel}>Sizes:</span>
                                    <span className={styles.attributeValue}>
                                      {product.sizes.join(', ')}
                                    </span>
                                  </div>
                                )}
                                <button
                                  className={styles.buyButton}
                                  onClick={() => handleBuyProduct(product)}
                                >
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !showOrderCard &&
                        msg.message.toLowerCase().includes('found') &&
                        msg.message.toLowerCase().includes('product') && (
                          <div className={styles.emptyProductState}>
                            <div className={styles.emptyProductIcon}>🔍</div>
                            <p className={styles.emptyProductText}>
                              No products found matching your search
                            </p>
                          </div>
                        )
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {isAgentSpeaking && (
              <div className={`${styles.messageRow} ${styles.agentRow}`}>
                <div className={styles.messageAvatar}>🤖</div>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <div className={styles.inputContainer}>
            {/* Mic Button */}
            <button
              className={`${styles.micButton} ${isListening ? styles.listening : ''} ${isMuted ? styles.muted : ''}`}
              onClick={handleMicToggle}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMuted ? (
                  <>
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  </>
                ) : (
                  <>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </>
                )}
              </svg>
              {isListening && <div className={styles.micPulse} />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              className={styles.textInput}
              placeholder="Type your message..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
            />

            {/* Send Button */}
            <button
              className={styles.sendButton}
              onClick={handleSendText}
              disabled={!textInput.trim()}
              aria-label="Send message"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
