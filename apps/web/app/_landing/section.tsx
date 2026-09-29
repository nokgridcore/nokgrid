import type { HTMLAttributes, ReactNode } from "react";

/** Page-width section: token gutters on mobile, the wide page margin on desktop. */
export function Section({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={[
        "border-b border-border-default bg-background-surface px-layout-page-horizontal py-16 lg:px-32 lg:py-24",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={["flex max-w-3xl flex-col gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-style-label-sm uppercase tracking-widest text-text-brand">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-balance text-style-display-lg tracking-tight text-text-primary lg:text-style-display-xl"
      >
        {title}
      </h2>
      <p className="text-pretty text-style-body-lg text-text-secondary">
        {description}
      </p>
    </header>
  );
}
