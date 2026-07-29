/// <reference types="vite/client" />

declare module "*.css";

declare module "@nokgridcore/tokens/tailwind-theme" {
  export const nokTailwindTheme: {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    fontFamily: Record<string, string>;
    textStyles: Record<
      string,
      {
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: number;
        lineHeight?: string;
      }
    >;
  };
}
