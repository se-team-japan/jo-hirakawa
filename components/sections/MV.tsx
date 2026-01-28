'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import profileData from '@/content/static/profile.json';

export default function MV() {
  const heroImage = profileData.heroImage || '/images/hero.jpg';

  return (
    <section id="top" className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 w-full h-full">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={profileData.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Hero Image</div>
          </div>
        )}
        {/* オーバーレイ（画像の上に薄い黒を重ねてテキストを見やすく） */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* オーバーレイテキスト */}
      {/* <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-wider mb-4">
          {profileData.name}
        </h1>
        <p className="font-display text-sm md:text-base uppercase tracking-widest opacity-80">
          {profileData.oneLiner}
        </p>
      </motion.div> */}
    </section>
  );
}

