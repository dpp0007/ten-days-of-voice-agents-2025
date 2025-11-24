"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface WellnessWelcomeProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WellnessWelcome = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WellnessWelcomeProps) => {
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale");

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-[#FFFFFF] to-[#F8F8F8]">
      {/* Subtle ambient background */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        animate={{
          background: [
            "radial-gradient(circle at 50% 40%, #6366F1 0%, transparent 60%)",
            "radial-gradient(circle at 50% 40%, #8B5CF6 0%, transparent 60%)",
            "radial-gradient(circle at 50% 40%, #6366F1 0%, transparent 60%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-12 sm:py-16">
        {/* Top section with breathing animation */}
        <div className="flex flex-1 flex-col items-center justify-center space-y-10 sm:space-y-12">
          {/* Breathing circle - simplified and elegant */}
          <motion.div
            className="relative"
            animate={{
              scale: breathPhase === "inhale" ? 1.15 : 0.95,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
                boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)",
              }}
              animate={{
                opacity: breathPhase === "inhale" ? 1 : 0.7,
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="h-3 w-3 rounded-full bg-white"
                  animate={{
                    scale: breathPhase === "inhale" ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Breathing instruction */}
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-indigo-500"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {breathPhase === "inhale" ? "Breathe in" : "Breathe out"}
          </motion.p>

          {/* Title and subtitle - improved hierarchy */}
          <div className="space-y-4 text-center max-w-md">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Your Daily Wellness
              <br />
              Companion
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              Take a moment for yourself
            </p>
          </div>
        </div>

        {/* CTA Button - refined design */}
        <motion.button
          onClick={onStartCall}
          className="group relative w-full max-w-sm overflow-hidden rounded-full px-8 py-5 text-base sm:text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">{startButtonText || "Begin Session"}</span>
        </motion.button>
      </div>
    </div>
  );
};
