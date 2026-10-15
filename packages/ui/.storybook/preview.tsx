import '../src/globals.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'todo',
		},
		options: {
			storySort: {
				order: [
					'Getting Started',
					['Overview', 'Installation', ['For designers', 'For developers', 'For product teams'], 'Theming', ['Light & dark mode', 'Theming in Figma', 'Theming in code'], 'Changelog'],
					'Foundations',
					['Overview', 'Colour', 'Typography', 'Spacing', 'Sizing', 'Radius', 'Shadow'],
					'Components',
					[
						'Action',
						'Input & control',
						[
							'Calendar',
							['Calendar', 'Day', 'Picker', 'Picker cell'],
							'Checkbox',
							'Chip',
							['Chip', 'Chip group'],
							'Input',
							['Text', 'Textarea', 'Search'],
							'Radio',
							'Select',
							['Select', 'Menu', 'Option'],
							'Toggle',
						],
						'Data display',
						['Avatar', 'Badge', ['Badge', 'Count'], 'Divider', 'Icon tile', 'KPI value delta', 'Legend', ['Legend', 'Item'], 'Progress', ['Progress', 'Segment', 'Stepped'], 'Status dot'],
						'Charts',
						['Bar chart', ['Bar chart', 'Segment', 'Stack'], 'Chart frame', 'Chart skeleton', 'Donut chart', ['Donut chart', 'Segment'], 'Line chart', ['Line chart', 'Series'], 'Sparkline'],
						'Feedback & status',
						['Alert', 'Toast', 'Tooltip', ['Tooltip', 'Row']],
						'Surfaces',
						['Card', 'Modal', ['Modal', 'Body', 'Footer', 'Header'], 'Popover'],
						'Navigation',
						[
							'Breadcrumb',
							['Breadcrumb', 'Item'],
							'Menu',
							['Menu', 'Header', 'Item'],
							'Pagination',
							['Pagination', 'Button'],
							'Sidebar',
							['Sidebar', 'Footer', 'Group', 'Header', 'Subgroup'],
							'Tabs',
							['Tabs', 'Group', 'Group vertical'],
							'Topbar',
						],
						'Data & tables',
						['Table', ['Record', 'Cell', 'Header cell', 'Row', 'Toolbar']],
					],
					'*',
				],
			},
		},
	},
};

export default preview;
