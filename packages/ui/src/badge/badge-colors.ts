export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeAppearance = 'filled' | 'tinted';

// filled backgrounds use bg-{variant}-strong; tinted uses the base
// background-{variant} + border-{variant}, both paired with text-{variant}.
//
// Filled label color is per-variant per spec, not a single derived rule:
// - success, error, info: plain white in both themes.
// - warning: text-inverse — flips dark(light mode)/white(dark mode) on its
//   own, matching the spec exactly with no override needed.
export const badgeColorClasses: Record<BadgeVariant, Record<BadgeAppearance, string>> = {
	neutral: {
		filled: 'bg-background-sunken text-text-primary',
		tinted: 'border border-border-strong bg-background-overlay text-text-secondary',
	},
	primary: {
		filled: 'bg-background-brand text-text-white',
		tinted: 'border border-border-focus bg-background-brand-subtle text-text-brand',
	},
	success: {
		filled: 'bg-background-success-strong text-text-white',
		tinted: 'border border-border-success bg-background-success text-text-success',
	},
	warning: {
		filled: 'bg-background-warning-strong text-text-inverse',
		tinted: 'border border-border-warning bg-background-warning text-text-warning',
	},
	error: {
		filled: 'bg-background-error-strong text-text-white',
		tinted: 'border border-border-error bg-background-error text-text-error',
	},
	info: {
		filled: 'bg-background-info-strong text-text-white',
		tinted: 'border border-border-info bg-background-info text-text-info',
	},
};
