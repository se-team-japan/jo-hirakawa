"use client";

import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import FadeIn from "@/components/ui/FadeIn";
import ContactSection from "@/components/ContactSection";

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 border-t border-black/10">
      <Container>
        <FadeIn>
          <SectionTitle>CONTACT</SectionTitle>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ContactSection />
        </FadeIn>
      </Container>
    </section>
  );
}


