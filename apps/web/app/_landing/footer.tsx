import Image from "next/image";
import { LINKS } from "./links";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Components", href: LINKS.docs },
      { label: "Docs", href: LINKS.docs },
      { label: "Figma library", href: LINKS.figmaLibrary },
    ],
  },
  {
    title: "Code",
    links: [
      { label: "GitHub", href: LINKS.github },
      { label: "npm · @nokgridcore/ui", href: LINKS.npmUi },
      { label: "npm · @nokgridcore/tokens", href: LINKS.npmTokens },
      { label: "Storybook", href: LINKS.docs },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Licence", href: LINKS.license },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="flex flex-col gap-10 border-t border-border-default bg-background-surface px-layout-page-horizontal pb-10 pt-16 lg:px-32">
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Image
            src="/landing/wordmark.svg"
            alt="NokgridCore"
            width={150}
            height={24}
          />
          <p className="text-style-body-sm text-text-secondary">
            The design system for dense, data-heavy dashboards. Figma, React and
            Tailwind from one token layer.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-10 sm:flex sm:gap-16"
        >
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex min-w-0 flex-col gap-3">
              <p className="text-style-label-sm text-text-secondary">
                {column.title}
              </p>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-style-body-sm text-text-primary hover:text-text-brand sm:whitespace-nowrap"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col justify-between gap-2 border-t border-border-default pt-6 text-style-caption-md text-text-tertiary sm:flex-row">
        <div className="flex gap-4">
          <p>© {new Date().getFullYear()} NokGridCore</p>
          <p>MIT licence</p>
        </div>
        <p>Built with NokGridCore</p>
      </div>
    </footer>
  );
}
