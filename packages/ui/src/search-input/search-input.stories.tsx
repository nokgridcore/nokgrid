import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput, SearchInputProps } from './search-input.js';

interface SearchInputStoryProps extends SearchInputProps {
	theme?: 'light' | 'dark';
}

const SearchInputWithTheme = ({ theme = 'light', ...props }: SearchInputStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<SearchInput {...props} />
	</div>
);

const meta = {
	title: 'Components/Input/Search',
	component: SearchInputWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'underline'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		state: {
			control: 'select',
			options: ['default', 'hovered', 'focused', 'disabled'],
		},
		showBg: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
		showClear: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'default',
		size: 'sm',
		state: 'default',
		placeholder: 'Search...',
		showClear: false,
		theme: 'light',
	},
} satisfies Meta<typeof SearchInputWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
