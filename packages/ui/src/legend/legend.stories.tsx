import type { Meta, StoryObj } from '@storybook/react-vite';
import { Legend, LegendProps } from './legend.js';

// Storybook's URL/Controls args can't round-trip a select that mixes numbers
// and strings, so the control uses all-string options and the wrapper coerces
// the numeric ones back before handing them to Legend.
const COLOR_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', 'neutral', 'positive', 'negative'];
const COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 'neutral', 'positive', 'negative'] as const;
const toColor = (c: unknown): LegendProps['color'] =>
	/^[1-8]$/.test(String(c)) ? (Number(c) as LegendProps['color']) : (c as LegendProps['color']);

interface LegendStoryProps extends Omit<LegendProps, 'color'> {
	color?: string;
	theme?: 'light' | 'dark';
}

const LegendWithTheme = ({ theme = 'light', color, ...props }: LegendStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<Legend color={toColor(color)} {...props} />
	</div>
);

const meta = {
	title: 'Components/Data display/Legend/Legend',
	component: LegendWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Maps colours to series names for any chart.` } } },
	argTypes: {
		swatchShape: { control: 'select', options: ['line', 'square', 'circle'] },
		color: { control: 'select', options: COLOR_OPTIONS },
		label: { control: 'text' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		swatchShape: 'square',
		color: '1',
		label: 'Series label',
		theme: 'light',
	},
	render: (args) => <LegendWithTheme {...args} />,
} satisfies Meta<typeof LegendWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllColors: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
			{COLORS.map((c) => (
				<Legend key={String(c)} swatchShape={args.swatchShape} color={c} label={String(c)} />
			))}
		</div>
	),
};

export const Shapes: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', display: 'flex', gap: '16px' }}>
			<Legend swatchShape='line' color={1} label='Line' />
			<Legend swatchShape='square' color={1} label='Square' />
			<Legend swatchShape='circle' color={1} label='Circle' />
		</div>
	),
};
