"use client";

import { motion } from "motion/react";

export function WellnessLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#FAFAFA] via-[#FFFFFF] to-[#F8F8F8]">
      {/* Animated breathing circle */}
      <motion.div
        className="relative mb-8"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="h-24 w-24 rounded-full"
          style={{
            background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 50%, #FFB4B4 100%)",
            boxShadow: "0 20px 60px rgba(255, 107, 107, 0.3)",
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
        </motion.div>
      </motion.div>
      
      {/* Loading text */}
      <div className="text-gray-700 text-lg font-medium">
        Preparing your wellness companion
        <span className="inline-flex ml-1">
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >
            .
          </motion.span>
        </span>
      </div>
    </div>
  );
}
