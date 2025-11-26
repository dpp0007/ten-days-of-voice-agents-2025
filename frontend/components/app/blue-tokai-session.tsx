"use client";

import React, { useEffect, useState } from "react";
import type { AppConfig } from "@/app-config";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useConnectionTimeout } from "@/hooks/useConnectionTimout";
import { useDebugMode } from "@/hooks/useDebug";
import { useVoiceAssistant, useRoomContext } from "@livekit/components-react";
import { AnimatedGrid } from "@/components/app/animated-grid";
import styles from './blue-tokai-session.module.css';

const IN_DEVELOPMENT = process.env.NODE_ENV !== "production";

interface BlueTokaSessionProps {
  appConfig: AppConfig;
  onEndSession?: () => void;
}

export const BlueTokaSessionView = ({
  appConfig,
  onEndSession: endSessionProp,
  ...props
}: React.ComponentProps<"section"> & BlueTokaSessionProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const { state } = useVoiceAssistant();
  const room = useRoomContext();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // UI Mode: "welcome" (ordering) or "bill" (showing receipt)
  const [mode, setMode] = useState<"welcome" | "bill">("welcome");
  
  // Mic state for visual animation
  const [isMuted, setIsMuted] = useState(false);
  
  // HTML bill content from backend
  const [billHTML, setBillHTML] = useState<string>("");
  
  // Order history - store all completed orders
  const [orderHistory, setOrderHistory] = useState<Array<{
    name: string;
    drinkType: string;
    size: string;
    milk: string;
    extras: string[];
    token: string;
    timestamp: string;
  }>>([]);
  
  // Drink order details for visualization
  const [drinkOrder, setDrinkOrder] = useState<{
    size: 'small' | 'medium' | 'large';
    type: string;
    hasWhippedCream: boolean;
    hasFoam: boolean;
    temperature: 'hot' | 'cold';
    price: number;
  } | null>(null);
  
  // Animation state: idle, pouring, ready
  const [animationState, setAnimationState] = useState<'idle' | 'pouring' | 'ready'>('idle');
  
  const isAgentSpeaking = state === "speaking";
  const isListening = state === "listening";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start idle coffee animation when session starts
  useEffect(() => {
    // Trigger a generic coffee animation when the first message arrives
    if (messages.length > 0 && !drinkOrder) {
      console.log('🎬 Starting welcome coffee animation');
      
      // Show a generic medium latte as welcome animation
      setDrinkOrder({
        size: 'medium',
        type: 'Latte',
        hasWhippedCream: false,
        hasFoam: true,
        temperature: 'hot',
        price: 0
      });
      
      setAnimationState('pouring');
      
      setTimeout(() => {
        setAnimationState('ready');
      }, 2500);
    }
  }, [messages.length]);

  // Helper function to extract drink details from HTML and trigger animation
  const triggerAnimationFromHTML = (html: string) => {
    // Extract all values: [Customer, Drink, Size, Milk]
    const valueMatches = html.match(/<span class="value">([^<]+)<\/span>/g);
    console.log('🔍 Found values:', valueMatches);
    
    // Extract token number
    const tokenMatch = html.match(/Token:\s*([A-Z0-9-]+)/);
    const token = tokenMatch ? tokenMatch[1] : '';
    
    // Extract timestamp
    const timestampMatch = html.match(/Order placed:\s*([^<]+)/);
    const timestamp = timestampMatch ? timestampMatch[1].trim() : new Date().toISOString();
    
    if (valueMatches && valueMatches.length >= 3) {
      // Extract text from each match
      const values = valueMatches.map(match => {
        const text = match.match(/>([^<]+)</);
        return text ? text[1].trim() : '';
      });
      
      const customerName = values[0] || '';
      const drinkType = values[1] || 'Coffee';
      const size = values[2] || 'medium';
      const milk = values[3] || 'regular';
      
      console.log('📋 Extracted:', { customerName, drinkType, size, milk, token });
      console.log('🎬 Triggering animation NOW!');
      
      // Add to order history
      const newOrder = {
        name: customerName,
        drinkType,
        size,
        milk,
        extras: html.toLowerCase().includes('whipped') ? ['Whipped Cream'] : [],
        token,
        timestamp
      };
      
      setOrderHistory(prev => {
        const updated = [...prev, newOrder];
        console.log('📝 Added to order history. Total orders:', updated.length);
        console.log('📝 Order details:', newOrder);
        console.log('📝 Full history:', updated);
        return updated;
      });
      
      // Reset animation state first to ensure it replays
      setAnimationState('idle');
      setDrinkOrder(null);
      
      // Small delay to ensure state reset, then trigger new animation
      setTimeout(() => {
        // Trigger pouring animation
        setDrinkOrder({
          size: size.toLowerCase() as 'small' | 'medium' | 'large',
          type: drinkType,
          hasWhippedCream: html.toLowerCase().includes('whipped'),
          hasFoam: drinkType.toLowerCase().includes('latte') || drinkType.toLowerCase().includes('cappuccino'),
          temperature: html.toLowerCase().includes('iced') || html.toLowerCase().includes('cold') ? 'cold' : 'hot',
          price: 0
        });
        
        setAnimationState('pouring');
        console.log('✅ Animation state set to: pouring');
        
        setTimeout(() => {
          setAnimationState('ready');
          console.log('✅ Animation state set to: ready');
        }, 2500);
      }, 50);
    } else {
      console.log('⚠️ Not enough values in HTML. Found:', valueMatches?.length);
    }
  };

  // Listen for data messages (HTML receipts)
  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array, participant: any) => {
      console.log('📦 Data message received from:', participant?.identity);
      const message = new TextDecoder().decode(payload);
      console.log('📦 Data message length:', message.length);
      console.log('📦 Data message preview:', message.substring(0, 200));
      
      const htmlMatch = message.match(/HTML_SNIPPET:([\s\S]*?)END_HTML_SNIPPET/);
      if (htmlMatch) {
        const html = htmlMatch[1].trim();
        setBillHTML(html);
        console.log('✅ Bill HTML received via data message, length:', html.length);
        console.log('🎬 Triggering animation from HTML');
        triggerAnimationFromHTML(html);
      } else {
        console.log('⚠️ No HTML_SNIPPET found in data message');
        console.log('⚠️ Message content:', message);
      }
    };

    console.log('📡 Setting up data message listener on room:', room.name);
    room.on('dataReceived', handleDataReceived);
    
    return () => {
      console.log('🔌 Removing data message listener');
      room.off('dataReceived', handleDataReceived);
    };
  }, [room]);

  // Extract HTML bill from messages (fallback method)
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage?.message) {
      const msg = lastMessage.message;
      
      console.log('📨 New message received, checking for HTML...');
      
      // Extract HTML bill if present (fallback method)
      const htmlMatch = msg.match(/HTML_SNIPPET:(.*?)END_HTML_SNIPPET/);
      if (htmlMatch) {
        const html = htmlMatch[1].trim();
        setBillHTML(html);
        console.log('✅ Bill HTML received via chat message (fallback)');
        triggerAnimationFromHTML(html);
      }
    }
  }, [messages]);

  // Toggle mic mute - reuses existing LiveKit handler
  const handleMicToggle = async () => {
    try {
      const currentMuted = room.localParticipant.isMicrophoneEnabled === false;
      await room.localParticipant.setMicrophoneEnabled(currentMuted);
      setIsMuted(!currentMuted);
    } catch (error) {
      console.error('Error toggling mic:', error);
    }
  };

  // Show bill view - always allow clicking
  const handleShowBill = () => {
    console.log('🧾 Show Bill clicked. Order history length:', orderHistory.length);
    console.log('🧾 Order history:', orderHistory);
    setMode("bill");
  };

  // Reorder - restart conversation from beginning
  const handleReorder = async () => {
    try {
      // Reset UI state
      setMode("welcome");
      setDrinkOrder(null);
      setBillHTML("");
      setAnimationState('idle');
      
      // Disconnect and reconnect to restart the agent conversation
      if (room.state !== 'disconnected') {
        await room.disconnect();
      }
      
      // Trigger session restart by calling endSession then startSession
      if (endSessionProp) {
        endSessionProp();
      }
      
      // Small delay to ensure clean disconnect
      setTimeout(() => {
        window.location.reload(); // Reload to start fresh
      }, 500);
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  // Back to ordering from bill view
  const handleBackToOrdering = () => {
    setMode("welcome");
  };

  // Handle back button - disconnect and end session
  const handleBack = async () => {
    try {
      // Disconnect from LiveKit room
      if (room.state !== 'disconnected') {
        await room.disconnect();
      }
      // Call parent's endSession if provided
      if (endSessionProp) {
        endSessionProp();
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return (
    <section className={styles.container} {...props}>
      {/* Blue Tokai gradient background */}
      <div className={styles.background}></div>
      
      {/* Animated Grid Pattern */}
      <AnimatedGrid />
      
      {/* MODE: WELCOME (Chat) */}
      {mode === "welcome" && (
        <div className={styles.fullScreenChat}>
          {/* AI Status Indicator */}
          <div className={styles.aiIndicator}>
            <div className={`${styles.aiAvatar} ${isAgentSpeaking ? styles.speaking : isListening ? styles.listening : ''}`}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
              {isAgentSpeaking && (
                <div className={styles.speakingWaves}>
                  <div className={styles.wave}></div>
                  <div className={styles.wave}></div>
                  <div className={styles.wave}></div>
                </div>
              )}
            </div>
            <div className={styles.aiStatus}>
              <span className={styles.aiName}>Alex</span>
              <span className={styles.aiState}>
                {isAgentSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg, index) => {
              const isUser = msg.from?.identity === room.localParticipant.identity;
              return (
                <div 
                  key={index} 
                  className={isUser ? styles.userMessage : styles.agentMessage}
                >
                  <div className={styles.messageContent}>
                    {msg.message}
                  </div>
                </div>
              );
            })}
            
            {messages.length === 0 && (
              <div className={styles.emptyChat}>
                <div className={styles.emptyChatIcon}>💬</div>
                <p>Start speaking to begin the conversation...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* MODE: BILL (Order History) */}
      {mode === "bill" && (
        <div className={styles.billLayout}>
          <div className={styles.billCard}>
            {/* Back to ordering button */}
            <button className={styles.backToOrderButton} onClick={handleBackToOrdering}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to ordering</span>
            </button>

            {/* Order History */}
            {orderHistory.length > 0 ? (
              <div className={styles.orderHistoryContainer}>
                <h2 className={styles.orderHistoryTitle}>Lead History</h2>
                <p className={styles.orderHistorySubtitle}>Leads captured in this session</p>
                
                {orderHistory.map((order, index) => (
                  <div key={index} className={styles.orderCard}>
                    <div className={styles.orderCardHeader}>
                      <div className={styles.orderNumber}>Order #{orderHistory.length - index}</div>
                      <div className={styles.orderToken}>{order.token}</div>
                    </div>
                    
                    <div className={styles.orderCardBody}>
                      <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>Customer:</span>
                        <span className={styles.orderValue}>{order.name}</span>
                      </div>
                      <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>Drink:</span>
                        <span className={styles.orderValue}>{order.drinkType}</span>
                      </div>
                      <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>Size:</span>
                        <span className={styles.orderValue}>{order.size}</span>
                      </div>
                      <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>Milk:</span>
                        <span className={styles.orderValue}>{order.milk}</span>
                      </div>
                      {order.extras.length > 0 && (
                        <div className={styles.orderRow}>
                          <span className={styles.orderLabel}>Extras:</span>
                          <span className={styles.orderValue}>{order.extras.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.orderCardFooter}>
                      <span className={styles.orderTimestamp}>
                        {new Date(order.timestamp).toLocaleString()}
                      </span>
                      <span className={styles.orderStatus}>✓ Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyBill}>
                <div className={styles.emptyChatIcon}>🎯</div>
                <h3 style={{ color: '#f58634', marginBottom: '10px' }}>No Leads Yet</h3>
                <p>Start a conversation to capture your first lead</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM PILL-SHAPED FEATURE BAR */}
      <div className={styles.pillBar}>
        <div className={styles.pillBarInner}>
          {/* 1. Back Button */}
          <button 
            className={styles.backButton}
            onClick={handleBack}
            aria-label="Back to welcome"
            title="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>

          {/* 2. Animated Mic Button - reuses existing LiveKit handler */}
          <button 
            className={`${styles.micButton} ${isListening ? styles.listening : ''} ${isMuted ? styles.muted : ''}`}
            onClick={handleMicToggle}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMuted ? (
                <>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                </>
              ) : (
                <>
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </>
              )}
            </svg>
            {isListening && <div className={styles.micPulse}></div>}
          </button>

          {/* 3. Show Bill Button - Always enabled */}
          <button 
            className={styles.pillButton}
            onClick={handleShowBill}
            title="Show Bill"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span>Show Bill</span>
          </button>

          {/* 4. Reorder Button */}
          <button 
            className={styles.pillButton}
            onClick={handleReorder}
            title="Reorder"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
            </svg>
            <span>Reorder</span>
          </button>
        </div>
      </div>
    </section>
  );
};
