'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Compact character sheet card for right panel (desktop) / modal (mobile)
export function CharacterSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile: Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-14 right-3 z-40 bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg shadow-lg transition-colors font-semibold text-xs flex items-center gap-1"
      >
        <span>⚔️</span>
        <span>Character</span>
      </button>

      {/* Mobile: Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-2xl border-t border-amber-900/30 shadow-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-amber-900/30 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚔️</span>
                  <h3 className="text-base font-bold text-amber-500">Character Sheet</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>
              <CharacterSheetContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop: Inline Card */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-lg border border-amber-900/30 shadow-xl p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
          <span className="text-lg">⚔️</span>
          <h3 className="text-sm font-bold text-amber-500">Character</h3>
        </div>
        <CharacterSheetContent />
      </div>
    </>
  );
}

function CharacterSheetContent() {
  return (
    <div className="p-4 lg:p-0">
      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">HP</span>
          <span className="text-xs font-mono text-gray-300">20/20</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all"
            style={{ width: '100%' }}
          />
        </div>
        <p className="text-xs text-green-400 mt-1">Stable</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-800/50 rounded p-3 text-center">
          <div className="text-xs text-gray-400">STR</div>
          <div className="text-xl font-bold text-gray-200">12</div>
        </div>
        <div className="bg-slate-800/50 rounded p-3 text-center">
          <div className="text-xs text-gray-400">INT</div>
          <div className="text-xl font-bold text-gray-200">12</div>
        </div>
        <div className="bg-slate-800/50 rounded p-3 text-center">
          <div className="text-xs text-gray-400">LCK</div>
          <div className="text-xl font-bold text-gray-200">12</div>
        </div>
      </div>

      {/* Inventory */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2 font-semibold">Inventory</div>
        <div className="bg-slate-800/30 rounded p-3 text-center">
          <p className="text-xs text-gray-500 italic">Empty</p>
        </div>
      </div>

      {/* Quest */}
      <div>
        <div className="text-xs text-gray-400 mb-2 font-semibold">Active Quest</div>
        <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3">
          <p className="text-sm text-gray-300">
            ✨ Discover the glowing mark
          </p>
        </div>
      </div>
    </div>
  );
}
