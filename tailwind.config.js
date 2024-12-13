/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	prefix: 'tw-',
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--tw-radius)',
  			md: 'calc(var(--tw-radius) - 2px)',
  			sm: 'calc(var(--tw-radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--tw-background))',
  			foreground: 'hsl(var(--tw-foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--tw-card))',
  				foreground: 'hsl(var(--tw-card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--tw-popover))',
  				foreground: 'hsl(var(--tw-popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--tw-primary))',
  				foreground: 'hsl(var(--tw-primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--tw-secondary))',
  				foreground: 'hsl(var(--tw-secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--tw-muted))',
  				foreground: 'hsl(var(--tw-muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--tw-accent))',
  				foreground: 'hsl(var(--tw-accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--tw-destructive))',
  				foreground: 'hsl(var(--tw-destructive-foreground))'
  			},
  			border: 'hsl(var(--tw-border))',
  			input: 'hsl(var(--tw-input))',
  			ring: 'hsl(var(--tw-ring))',
  			chart: {
  				'1': 'hsl(var(--tw-chart-1))',
  				'2': 'hsl(var(--tw-chart-2))',
  				'3': 'hsl(var(--tw-chart-3))',
  				'4': 'hsl(var(--tw-chart-4))',
  				'5': 'hsl(var(--tw-chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
