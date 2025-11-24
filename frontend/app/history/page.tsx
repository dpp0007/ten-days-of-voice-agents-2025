"use client";

import { motion } from "motion/react";
import SessionScreen from "@/components/app/session-screen";

export default function HistoryPage() {
  const sessions = [
    {
      id: 1,
      date: "Today, 2:30 PM",
      duration: "12 min",
      mood: "Calm",
      color: "#FF5C5C",
    },
    {
      id: 2,
      date: "Yesterday, 9:15 AM",
      duration: "8 min",
      mood: "Energized",
      color: "#FFE3DD",
    },
    {
      id: 3,
      date: "Nov 22, 6:45 PM",
      duration: "15 min",
      mood: "Reflective",
      color: "#FF7A7A",
    },
  ];

  return (
    <SessionScreen conversationText="Your Wellness Journey">
      <div className="space-y-4 px-4">
        <h2 className="text-2xl font-bold text-[#1C1C1C]">Session History</h2>
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${session.color}, #FFE3DD)`,
                    }}
                  />
                  <div>
                    <p className="font-semibold text-[#1C1C1C]">
                      {session.mood}
                    </p>
                    <p className="text-sm text-gray-500">{session.date}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {session.duration}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SessionScreen>
  );
}
