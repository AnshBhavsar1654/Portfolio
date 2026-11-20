import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/site/section";
import { WorkFilter } from "./work-filter";

export const metadata: Metadata = { title: "Projects" };

export default function WorkPage() {
  return (
    <Section first className="pt-32 md:pt-40">
      <SectionHeading
        title="Everything I have"
        accent="shipped."
        body="Systems with live demos and public code. Each page notes what it does and how it is measured."
      />
      <div className="mt-12">
        <WorkFilter />
      </div>
    </Section>
  );
}
