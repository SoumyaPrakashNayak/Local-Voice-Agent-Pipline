/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'border-soft': 'var(--border-soft)',
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        'text-faint': 'var(--text-faint)',
        brand: 'var(--brand)',
        'brand-bright': 'var(--brand-bright)',
        accent: 'var(--accent)',
        'accent-bright': 'var(--accent-bright)',
        danger: 'var(--danger)',
        'danger-bright': 'var(--danger-bright)',
        success: 'var(--success)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        serif: ["Source Serif 4", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        data: "-0.5px",
        heading: "-0.3px",
      },
      lineHeight: {
        heading: "1.2",
        section: "1.3",
        label: "1.4",
        body: "1.5",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.37)",
        card: "0 4px 24px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
