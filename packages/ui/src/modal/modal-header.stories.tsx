import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModalHeader, ModalHeaderProps } from './modal-header.js';

interface ModalHeaderStoryProps extends ModalHeaderProps {
	theme?: 'light' | 'dark';
}

const ModalHeaderWithTheme = ({ theme = 'light', ...props }: ModalHeaderStoryProps) => {
	// ModalHeader itself has no fixed width — Modal owns sizing (small/
	// medium/large) and ModalHeader just stretches to fill it. In isolation
	// here, the "hero" preview gets a 640px (medium) width of its own and is
	// centered in the canvas; "standard" stays a plain full-width block so
	// its inline close button's margin-left: auto still has room to push
	// into.
	const isHero = (props.artworkType ?? 'hero') === 'hero';

	return (
		<div
			data-theme={theme === 'dark' ? 'dark' : undefined}
			style={{
				background: 'var(--nok-color-background-surface)',
				width: '100%',
				padding: '2rem',
				...(isHero ? { display: 'flex', justifyContent: 'center' } : undefined),
			}}>
			<ModalHeader {...props} style={isHero ? { width: '640px' } : undefined} />
		</div>
	);
};

const meta = {
	title: 'Components/Surfaces/Modal/Header',
	component: ModalHeaderWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `The title, optional subtitle and close control of a modal.` } } },
	argTypes: {
		artworkType: {
			control: 'select',
			options: ['hero', 'standard'],
		},
		titleStyle: {
			control: 'select',
			options: ['standard', 'promotional'],
		},
		closeButtonPosition: {
			control: 'select',
			options: ['overlay', 'inline'],
		},
		title: {
			control: 'text',
		},
		showTitle: {
			control: 'boolean',
		},
		showArtwork: {
			control: 'boolean',
		},
		showCloseButton: {
			control: 'boolean',
		},
		subtitle: {
			control: 'text',
		},
		showSubtitle: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		artworkType: 'hero',
		titleStyle: 'standard',
		closeButtonPosition: 'overlay',
		title: 'Modal title',
		showTitle: true,
		showArtwork: true,
		showCloseButton: true,
		subtitle: 'Modal subtitle',
		showSubtitle: false,
		theme: 'light',
	},
} satisfies Meta<typeof ModalHeaderWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
