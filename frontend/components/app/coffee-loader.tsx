"use client";

import styles from './coffee-loader.module.css';

export function CoffeeLoader() {
  return (
    <div className={styles.coffeeLoader}>
      {/* Glassmorphism coffee cup */}
      <div className={styles.coffeeCupLoader}>
        {/* Glass Cup */}
        <div className={styles.glassCup}>
          {/* Coffee liquid */}
          <div className={styles.coffeeLiquid}></div>
          
          {/* Glass shine effect */}
          <div className={styles.glassShine}></div>
        </div>
        
        {/* Steam */}
        <div className={styles.steamWrapper}>
          <div className={`${styles.steam} ${styles.steam1}`}></div>
          <div className={`${styles.steam} ${styles.steam2}`}></div>
          <div className={`${styles.steam} ${styles.steam3}`}></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className={styles.loadingText}>
        <span>Brewing</span>
        <span className={styles.dots}>
          <span className={styles.dot1}>.</span>
          <span className={styles.dot2}>.</span>
          <span className={styles.dot3}>.</span>
        </span>
      </div>
    </div>
  );
}
