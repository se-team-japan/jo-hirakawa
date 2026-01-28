'use client';

import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';
import newsData from '@/content/static/news.json';

export default function News() {
  return (
    <section id="news" className="py-20 md:py-32 border-t border-black/10">
      <Container>
        <FadeIn>
          <SectionTitle>INFORMATION</SectionTitle>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <ul className="space-y-0">
            {newsData.items.map((item, index) => (
              <li
                key={index}
                className="border-b border-black/10 py-4 md:py-5 hover:opacity-70 transition-opacity"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <time className="font-display text-xs md:text-sm uppercase tracking-wider text-black/60 min-w-[100px]">
                    {item.date}
                  </time>
                  <p className="font-body text-sm md:text-base">
                    {item.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>
    </section>
  );
}




