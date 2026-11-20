import type { Metadata } from "next";
import { ContactBlock } from "@/components/home/contact-block";
import { Section, SectionHeading } from "@/components/site/section";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section first className="pt-32 md:pt-40">
      <SectionHeading
        title="Start a"
        accent="conversation."
        body="Whether you are hiring or building, one short message is enough. I reply within two days."
      />
      <div className="mt-12">
        <ContactBlock />
      </div>
    </Section>
  );
}
