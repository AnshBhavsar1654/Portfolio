import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-24 text-center md:py-36">
      <h1 className="text-strong text-5xl font-semibold tracking-tight">
        Nothing here.
      </h1>
      <p className="text-body mx-auto mt-3 max-w-[45ch]">
        That page does not exist. The work is back home.
      </p>
      <Link
        href="/"
        className="bg-accent text-on-accent hover:bg-accent-hover mt-6 inline-block rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors"
      >
        Back home
      </Link>
    </div>
  );
}
