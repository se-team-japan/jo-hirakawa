'use client';

import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';
import profileData from '@/content/static/profile.json';
import Image from 'next/image';

export default function Profile() {
  const portrait = profileData.portrait || '/images/portrait.jpg';
  const displayName = profileData.nameJa || profileData.name;

  return (
    <section id="profile" className="py-16 md:py-24">
      <Container>
        <FadeIn>
          <SectionTitle>PROFILE</SectionTitle>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* 写真 */}
          <FadeIn delay={0.2}>
            <div className="relative w-full max-w-md md:max-w-none mx-auto aspect-[3/4] bg-gray-100 overflow-hidden">
              <Image
                src={portrait}
                alt={displayName}
                fill
                sizes="(min-width: 768px) 50vw, 80vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
          
          {/* テキスト */}
          <FadeIn delay={0.4}>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-2">
                  {displayName}
                </h3>
                <p className="font-display text-sm uppercase tracking-widest text-black/60 mb-6">
                  {profileData.oneLiner}
                </p>
              </div>
              <div className="font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
                {profileData.bioShort}
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

