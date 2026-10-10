import type { Metadata } from "next";
import { ContactBlock } from "@/components/home/contact-block";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section first className="pt-12 md:pt-20">
      <Reveal>
        <SectionHeading
          title="Start a"
          accent="project."
          body="One short message is enough: what you are building and how we will measure it."
        />
      </Reveal>
      <Reveal className="mt-12">
        <ContactBlock />
      </Reveal>
    </Section>
  );
}
