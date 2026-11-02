import type { Metadata } from "next";
import { ContactBlock } from "@/components/home/contact-block";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section first className="pt-32 md:pt-40">
      <Reveal>
        <SectionHeading
          title="Start a"
          accent="conversation."
          body="Whether you are hiring or building, one short message is enough. I reply within two days."
        />
      </Reveal>
      <Reveal className="mt-12">
        <ContactBlock />
      </Reveal>
    </Section>
  );
}
