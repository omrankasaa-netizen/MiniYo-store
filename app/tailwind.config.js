/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
      extend: {
        fontFamily: {
          display: ['"Playfair Display"', 'serif'],
          body: ['Inter', 'sans-serif'],
          accent: ['Poppins', 'sans-serif'],
        },
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          cream: "#F5F0E6",
          beige: "#D4C4B0",
          "sage-green": "#8FAE7B",
          "sage-dark": "#6B8E5A",
          "dark-teal": "#2D5A4C",
          "dark-teal-light": "#3D7A68",
          "muted-teal": "#6B8A7E",
          "border-beige": "#D4C9B8",
          "beige-dark": "#C4B49E",
          ivory: "#FFFDF8",
          blush: "#E8D5C4",
          "blush-light": "#F5EDE6",
          "blush-dark": "#D4B8A0",
          // Transitional aliases for existing component compatibility
          "brand-brown": "#2D5A4C",
          "brand-blush": "#D4C4B0",
          "brand-gold": "#8FAE7B",
          "brand-sage": "#7BA369",
          "brand-lavender": "#A8C4B0",
          "border-sand": "#D4C9B8",
          "gold-dark": "#6B8E5A",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          sidebar: {
            DEFAULT: "hsl(var(--sidebar-background))",
            foreground: "hsl(var(--sidebar-foreground))",
            primary: "hsl(var(--sidebar-primary))",
            "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
            accent: "hsl(var(--sidebar-accent))",
            "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
            border: "hsl(var(--sidebar-border))",
            ring: "hsl(var(--sidebar-ring))",
          },
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
          "caret-blink": {
            "0%,70%,100%": { opacity: "1" },
            "20%,50%": { opacity: "0" },
          },
          shimmer: {
            "0%": { backgroundPosition: "-200% 0" },
            "100%": { backgroundPosition: "200% 0" },
          },
          "bounce-slow": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(8px)" },
          },
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "caret-blink": "caret-blink 1.25s ease-out infinite",
          shimmer: "shimmer 1.5s infinite",
          "bounce-slow": "bounce-slow 2s infinite ease-in-out",
          float: "float 3s infinite ease-in-out",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
