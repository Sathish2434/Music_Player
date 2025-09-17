/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
        border: "var(--color-border)", // slate-400 with opacity
        input: "var(--color-input)", // custom-elevated-surface
        ring: "var(--color-ring)", // indigo-500
        background: "var(--color-background)", // custom-dark-navy
        foreground: "var(--color-foreground)", // slate-50
        primary: {
          DEFAULT: "var(--color-primary)", // indigo-500
          foreground: "var(--color-primary-foreground)", // slate-50
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // violet-500
          foreground: "var(--color-secondary-foreground)", // slate-50
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // red-500
          foreground: "var(--color-destructive-foreground)", // slate-50
        },
        muted: {
          DEFAULT: "var(--color-muted)", // slate-400
          foreground: "var(--color-muted-foreground)", // slate-400
        },
        accent: {
          DEFAULT: "var(--color-accent)", // amber-500
          foreground: "var(--color-accent-foreground)", // custom-dark
        },
        popover: {
          DEFAULT: "var(--color-popover)", // custom-elevated-surface
          foreground: "var(--color-popover-foreground)", // slate-50
        },
        card: {
          DEFAULT: "var(--color-card)", // custom-elevated-surface
          foreground: "var(--color-card-foreground)", // slate-50
        },
        surface: "var(--color-surface)", // custom-elevated-surface
        success: {
          DEFAULT: "var(--color-success)", // emerald-500
          foreground: "var(--color-success-foreground)", // slate-50
        },
        warning: {
          DEFAULT: "var(--color-warning)", // amber-500
          foreground: "var(--color-warning-foreground)", // custom-dark
        },
        error: {
          DEFAULT: "var(--color-error)", // red-500
          foreground: "var(--color-error-foreground)", // slate-50
        },
        // Audio-reactive colors
        'audio-low': "var(--color-audio-low)", // indigo-500
        'audio-mid': "var(--color-audio-mid)", // violet-500
        'audio-high': "var(--color-audio-high)", // amber-500
      },
      borderRadius: {
        lg: "var(--radius-lg)", // 1rem
        md: "var(--radius)", // 0.5rem
        sm: "calc(var(--radius) - 2px)", // 0.375rem
        full: "var(--radius-full)", // 9999px
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        caption: ['JetBrains Mono', 'monospace'],
        data: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'moderate': 'var(--shadow-moderate)',
        'prominent': 'var(--shadow-prominent)',
        'glow': 'var(--shadow-glow)',
        'neo-light': '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.02)',
        'neo-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.02)',
        'ambient': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(139, 92, 246, 0.2), 0 0 60px rgba(245, 158, 11, 0.1)',
      },
      animation: {
        'pulse-audio': 'pulseAudio 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounce 2s infinite',
      },
      keyframes: {
        pulseAudio: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '1'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        'glass': '20px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}