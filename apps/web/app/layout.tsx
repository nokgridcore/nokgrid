import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Resolves the social preview image (app/opengraph-image.jpg) to a full URL.
  metadataBase: new URL("https://nokgrid.vercel.app"),
  title: "NokGridCore — the design system for data-heavy dashboards",
  description:
    "Ship the same tokens, the same component names and the same behaviour in Figma and in code.",
};

// Runs before paint so a saved or system dark preference never flashes light.
const themeScript = `(function(){try{var t=localStorage.getItem('nok-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();`;

// Marks the page once the web fonts have loaded (or after a short wait), so the
// hero entrance starts on the final fonts instead of reflowing mid-animation.
const fontsScript = `(function(){var d=document.documentElement,done=function(){d.dataset.fontsReady=''};setTimeout(done,600);if(document.fonts&&document.fonts.ready){document.fonts.ready.then(done)}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: fontsScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- token font families are plain names, so the fonts must register under those names */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap"
        />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before hydration. */}
      <body suppressHydrationWarning className="antialiased">
        <a
          href="#main"
          className="sr-only rounded-md bg-background-surface px-4 py-2 text-style-label-lg text-text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-20"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
