/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
        /* Japanese-inspired zen garden colors */
        sakura: "hsl(var(--sakura))",
        bamboo: "hsl(var(--bamboo))",
        indigo: "hsl(var(--indigo))",
        terracotta: "hsl(var(--terracotta))",
        sky: "hsl(var(--sky))",
  			primary: {
  				'50': '#f0f9ff',
  				'100': '#e0f2fe',
  				'200': '#bae6fd',
  				'300': '#7dd3fc',
  				'400': '#38bdf8',
  				'500': '#0ea5e9',
  				'600': '#0284c7',
  				'700': '#0369a1',
  				'800': '#075985',
  				'900': '#0c4a6e',
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))"
  			},
  			secondary: {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a',
  				DEFAULT: "hsl(var(--secondary))",
  				foreground: "hsl(var(--secondary-foreground))"
  			},
  			accent: {
  				'50': '#f5f3ff',
  				'100': '#ede9fe',
  				'200': '#ddd6fe',
  				'300': '#c4b5fd',
  				'400': '#a78bfa',
  				'500': '#8b5cf6',
  				'600': '#7c3aed',
  				'700': '#6d28d9',
  				'800': '#5b21b6',
  				'900': '#4c1d95',
  				DEFAULT: "hsl(var(--accent))",
  				foreground: "hsl(var(--accent-foreground))"
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))"
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))"
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))"
  			},
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))"
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['Noto Sans JP', 'Inter', 'sans-serif'],
  		},
  		boxShadow: {
  			soft: '0 4px 14px 0 rgba(0, 0, 0, 0.03)',
  			medium: '0 6px 24px 0 rgba(0, 0, 0, 0.05)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'zen': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'zen-xl': '0 8px 20px rgba(0, 0, 0, 0.08), 0 1px 5px rgba(0, 0, 0, 0.02)',
        'washi': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)"
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: 0 },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: 0 },
  			},
  			"fade-in": {
  				from: { opacity: 0 },
  				to: { opacity: 1 },
  			},
  			"slide-in-from-bottom": {
  				from: { transform: "translateY(10px)", opacity: 0 },
  				to: { transform: "translateY(0)", opacity: 1 },
  			},
  			"zoom-in-50": {
  				from: { transform: "scale(0.95)", opacity: 0 },
  				to: { transform: "scale(1)", opacity: 1 },
  			},
        /* Japanese-inspired animations */
        "gentle-reveal": {
          "0%": { opacity: 0, transform: "translateY(5px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "brush-stroke": {
          "0%": { width: "0%", opacity: 0 },
          "100%": { width: "100%", opacity: 1 },
        },
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  			"fade-in": "fade-in 0.7s ease-out",
  			"slide-in": "slide-in-from-bottom 0.5s ease-out",
  			"zoom-in": "zoom-in-50 0.3s ease-out",
        "gentle-reveal": "gentle-reveal 0.5s ease-out forwards",
        "brush-stroke": "brush-stroke 1.2s ease-in-out forwards",
  		},
      /* Japanese-inspired spacing */
      spacing: {
        '7.5': '1.875rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '42': '10.5rem',
        '68': '17rem',
        '84': '21rem',
        '128': '32rem',
        '144': '36rem',
      },
      /* Japanese-inspired line heights */
      lineHeight: {
        'relaxed': '1.75',
        'loose': '2',
        'zen': '1.9',
      },
      /* Japanese-inspired letter spacing */
      letterSpacing: {
        'zen': '0.04em',
        'wide': '0.08em',
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
