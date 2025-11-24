"use client";

import { motion, AnimatePresence } from "motion/react";
import { Mic } from "lucide-react";

interface SessionScreenProps {
  isAgentSpeaking?: boolean;
  isListening?: boolean;
  conversationText?: string;
  children?: React.ReactNode;
}

export default function SessionScreen({
  isAgentSpeaking = false,
  isListening = false,
  conversationText = "Listening...",
  children,
}: SessionScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-[#FFFFFF] to-[#F8F8F8]">
      {/* Subtle ambient background */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        animate={{
          background: [
            "radial-gradient(circle at 50% 30%, #6366F1 0%, transparent 50%)",
            "radial-gradient(circle at 50% 30%, #8B5CF6 0%, transparent 50%)",
            "radial-gradient(circle at 50% 30%, #6366F1 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 sm:px-6 py-4 sm:py-6">
        {/* Top animated orb - positioned with top margin */}
        <div className="relative z-20 mb-4 sm:mb-6 mt-9">
          <motion.div
            className="relative"
            animate={{
              scale: isAgentSpeaking ? [1, 1.03, 1] : 1,
            }}
            transition={{
              duration: 1.2,
              repeat: isAgentSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFB4B4] blur-xl sm:blur-2xl"
              animate={{
                opacity: isAgentSpeaking ? [0.3, 0.6, 0.3] : 0.2,
                scale: isAgentSpeaking ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: isAgentSpeaking ? Infinity : 0,
                ease: "easeInOut",
              }}
            />

            {/* Main orb - smaller size */}
            <motion.div
              className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB4B4] shadow-2xl"
              animate={{
                borderRadius: isAgentSpeaking
                  ? [
                      "50% 50% 50% 50%",
                      "45% 55% 50% 50%",
                      "50% 50% 45% 55%",
                      "55% 45% 50% 50%",
                      "50% 50% 50% 50%",
                    ]
                  : "50% 50% 50% 50%",
              }}
              transition={{
                duration: 2,
                repeat: isAgentSpeaking ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {/* Inner glow */}
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                animate={{
                  scale: isAgentSpeaking ? [1, 1.5, 1] : 1,
                  opacity: isAgentSpeaking ? [0.2, 0.4, 0.2] : 0.2,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isAgentSpeaking ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />

              {/* Mic icon - smaller */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic className="h-10 w-10 sm:h-12 sm:w-12 text-white opacity-90" strokeWidth={2.5} />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Status text below orb - better visibility */}
        <AnimatePresence mode="wait">
          <motion.div
            key={conversationText}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-4 text-center"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              {conversationText}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Children content - better spacing */}
        {children && (
          <div className="w-full max-w-2xl mt-8">{children}</div>
        )}
      </div>
    </div>
  );
}
