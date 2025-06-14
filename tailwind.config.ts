import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // #F8F5F2 - Light Beige/Pink
        foreground: "hsl(var(--foreground))", // #1A1A2E - Dark Navy/Black (for text)
        primary: {
          DEFAULT: "hsl(var(--primary))", // #1A1A2E - Dark Navy/Black (for primary buttons, navbar)
          foreground: "hsl(var(--primary-foreground))", // #FFFFFF
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // #E9E3DC - Lighter beige for accents
          foreground: "hsl(var(--secondary-foreground))", // #1A1A2E
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // #F0ECE8
          foreground: "hsl(var(--muted-foreground))", // #4A4A6A - Muted text
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // #FF6B6B - Orange/Coral accent
          foreground: "hsl(var(--accent-foreground))", // #FFFFFF
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // #FFFFFF
          foreground: "hsl(var(--card-foreground))", // #1A1A2E
        },
        // Custom colors from the image
        brand: {
          navy: "#1A1A2E", // Dark navy for navbar and primary elements
          orange: "#FF6B6B", // Accent orange
          lightPink: "#F8F5F2", // Main background
          cardBeige: "#F3E9E0",
          cardTeal: "#3B8C8C", // A guess for the teal card
          cardDark: "#2D2D2D", // For the black card
        },
        // Specific UI colors
        "navbar-bg": "#1A1A2E",
        "navbar-text": "#FFFFFF",
        "hero-text-primary": "#1A1A2E",
        "hero-text-secondary": "#4A4A6A",
        "hero-accent": "#FF6B6B",
      },
      fontFamily: {
        // Using Manrope for headings (similar to image's modern sans-serif)
        // Using DM Sans for body (clean and readable)
        sans: ['"DM Sans"', "sans-serif"],
        heading: ['"Manrope"', "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
