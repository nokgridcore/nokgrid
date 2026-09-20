import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginationButton, PaginationButtonProps } from './pagination-button.js';

interface PaginationButtonStoryProps extends PaginationButtonProps {
	theme?: 'light' | 'dark';
}

const PaginationButtonWithTheme = ({ theme = 'light', ...props }: PaginationButtonStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<PaginationButton {...props} />
	</div>
);

const meta = {
	title: 'Components/Navigation/Pagination/Button',
	component: PaginationButtonWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `One page number inside pagination.` } } },
	argTypes: {
		state: {
			control: 'select',
			options: ['default', 'hovered', 'pressed', 'active', 'disabled'],
		},
		label: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		state: 'default',
		label: '1',
		theme: 'light',
	},
} satisfies Meta<typeof PaginationButtonWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
