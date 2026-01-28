'use client';

import siteData from '@/content/static/site.json';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const hasLogoImage = Boolean(siteData.logoImage);

  const instagram = siteData.social?.instagram;
  const tiktok = siteData.social?.tiktok;

  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 80; // sticky header 分のオフセット
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - headerOffset;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-container mx-auto px-6 md:px-8 relative">
        <nav className="flex items-center justify-between h-16 md:h-20 gap-6">
          {/* ロゴ */}
          <div className="flex items-center gap-3">
            {hasLogoImage ? (
              <Link
                href="/"
                aria-label={siteData.siteTitle}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('top');
                }}
              >
                <div className="relative h-7 w-auto">
                  <Image
                    src={siteData.logoImage}
                    alt={siteData.siteTitle}
                    width={140}
                    height={28}
                    className="h-7 w-auto object-contain"
                    priority
                  />
                </div>
              </Link>
            ) : (
              <Link
                href="/"
                className="font-display text-sm md:text-base tracking-wider leading-tight whitespace-pre-line"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('top');
                }}
              >
                {siteData.logoText}
              </Link>
            )}
          </div>

          {/* デスクトップナビ + SNS */}
          <div className="hidden md:flex items-center gap-6 md:gap-8">
            <ul className="flex items-center gap-4 md:gap-6">
              {siteData.nav.map((item) => {
                const sectionId = item === 'TOP' ? 'top' : item.toLowerCase();
                return (
                  <li key={item}>
                    <Link
                      href="/"
                      className="font-display text-xs md:text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(sectionId);
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {(instagram || tiktok) && (
              <div className="hidden md:flex items-center gap-4 text-xs font-display tracking-wider">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    INSTAGRAM
                  </a>
                )}
                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    TIKTOK
                  </a>
                )}
              </div>
            )}
          </div>

          {/* モバイル：ハンバーガー */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border border-black/20 h-9 w-9 hover:bg-black hover:text-white transition-colors"
            aria-label="メニューを開閉"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="sr-only">メニュー</span>
            <span className="relative flex h-4 w-5 items-center justify-center">
              <span
                className={`absolute block h-[1px] w-5 bg-current transition-all duration-200 ease-out ${
                  isOpen ? 'rotate-45' : '-translate-y-1'
                }`}
              />
              <span
                className={`absolute block h-[1px] w-5 bg-current transition-opacity duration-150 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute block h-[1px] w-5 bg-current transition-all duration-200 ease-out ${
                  isOpen ? '-rotate-45' : 'translate-y-1'
                }`}
              />
            </span>
          </button>
        </nav>

        {/* モバイルメニュー（スムーズなトグル・オーバーレイ表示） */}
        <div
          className={`
            md:hidden border-t border-black/10
            overflow-hidden
            transition-[max-height,opacity,transform] duration-250 ease-out
            absolute left-0 right-0
            bg-white/95 backdrop-blur-sm
            ${isOpen ? 'max-h-64 opacity-100 translate-y-0 pt-3 pb-4' : 'max-h-0 opacity-0 -translate-y-1'}
          `}
        >
          <div className="flex flex-col gap-4 px-6">
            <ul className="flex flex-col gap-2">
              {siteData.nav.map((item) => {
                const sectionId = item === 'TOP' ? 'top' : item.toLowerCase();
                return (
                  <li key={item}>
                    <Link
                      href="/"
                      className="font-display text-xs uppercase tracking-wider block py-1 hover:opacity-70 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(sectionId);
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {(instagram || tiktok) && (
              <div className="flex items-center gap-4 text-xs font-display tracking-wider">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    INSTAGRAM
                  </a>
                )}
                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    TIKTOK
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

