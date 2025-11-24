"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale");

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFE3DD] via-white to-[#FFF5F3]">
      {/* Animated breathing background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, #FF5C5C 0%, transparent 50%)",
            "radial-gradient(circle at 70% 50%, #FFE3DD 0%, transparent 50%)",
            "radial-gradient(circle at 30% 50%, #FF5C5C 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-12">
        {/* Top section with breathing animation */}
        <div className="flex flex-1 flex-col items-center justify-center space-y-8">
          {/* Lungs breathing animation */}
          <motion.div
            className="relative"
            animate={{
              scale: breathPhase === "inhale" ? 1.1 : 0.95,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="relative h-32 w-32"
              animate={{
                opacity: breathPhase === "inhale" ? 1 : 0.6,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full drop-shadow-lg"
              >
                {/* Left lung */}
                <motion.path
                  d="M 35 20 Q 25 25, 25 35 L 25 60 Q 25 70, 35 75 Q 40 77, 45 75 L 45 25 Q 40 23, 35 20"
                  fill="#FF5C5C"
                  animate={{
                    d:
                      breathPhase === "inhale"
                        ? "M 35 20 Q 20 25, 20 35 L 20 60 Q 20 75, 35 80 Q 40 82, 45 80 L 45 25 Q 40 23, 35 20"
                        : "M 35 20 Q 25 25, 25 35 L 25 60 Q 25 70, 35 75 Q 40 77, 45 75 L 45 25 Q 40 23, 35 20",
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
                {/* Right lung */}
                <motion.path
                  d="M 65 20 Q 75 25, 75 35 L 75 60 Q 75 70, 65 75 Q 60 77, 55 75 L 55 25 Q 60 23, 65 20"
                  fill="#FF5C5C"
                  animate={{
                    d:
                      breathPhase === "inhale"
                        ? "M 65 20 Q 80 25, 80 35 L 80 60 Q 80 75, 65 80 Q 60 82, 55 80 L 55 25 Q 60 23, 65 20"
                        : "M 65 20 Q 75 25, 75 35 L 75 60 Q 75 70, 65 75 Q 60 77, 55 75 L 55 25 Q 60 23, 65 20",
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
                {/* Trachea */}
                <path
                  d="M 50 10 L 50 30"
                  stroke="#FF5C5C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Breathing instruction */}
          <motion.p
            className="text-sm font-medium tracking-wide text-[#FF5C5C]"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {breathPhase === "inhale" ? "Breathe in..." : "Breathe out..."}
          </motion.p>

          {/* Title and subtitle */}
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#1C1C1C]">
              Your Daily Wellness
              <br />
              Companion
            </h1>
            <p className="text-lg text-gray-600">
              Let's take a moment for yourself
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={() => router.push("/")}
          className="group relative w-full max-w-sm overflow-hidden rounded-full bg-gradient-to-r from-[#FF5C5C] to-[#FF7A7A] px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="relative z-10">Begin Session</span>
        </motion.button>
      </div>
    </div>
  );
}
