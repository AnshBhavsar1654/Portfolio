import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Full-height sections share the scenery. The quote section adds a text halo
// so its type stays readable over the portraits.
export function BackdropSection({
  id,
  print,
  className,
  children,
}: {
  id?: string;
  print?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-16 px-4">
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-svh w-full max-w-[1200px] flex-col justify-center py-24 md:py-32",
          print && "halo",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
