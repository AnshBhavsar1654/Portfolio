import type { Metadata } from "next";
import { ContactBlock } from "@/components/home/contact-block";
import { Section, SectionHeading } from "@/components/site/section";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section first className="pt-32 md:pt-40">
      <SectionHeading
        as="h1"
        title="Start a"
        accent="conversation."
        body={profile.contact.availability}
      />
      <div className="mt-12">
        <ContactBlock />
      </div>
    </Section>
  );
}
