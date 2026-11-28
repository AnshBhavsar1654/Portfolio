import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/site/section";
import { WorkFilter } from "./work-filter";

export const metadata: Metadata = { title: "Projects" };

export default function WorkPage() {
  return (
    <Section first className="pt-32 md:pt-40">
      <SectionHeading as="h1" title="Everything I have" accent="shipped." />
      <div className="mt-12">
        <WorkFilter />
      </div>
    </Section>
  );
}
