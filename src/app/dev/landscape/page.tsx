import { notFound } from "next/navigation";
import { LandscapePlayground } from "./playground";

export default function Page() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <LandscapePlayground />;
}
