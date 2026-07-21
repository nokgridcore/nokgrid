import '../src/globals.css';
import React from 'react';
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
	},
	globalTypes: {
		theme: {
			description: 'Global theme for components',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'light', icon: 'sun', title: 'Light' },
					{ value: 'dark', icon: 'moon', title: 'Dark' },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: 'light',
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme || 'light';
			return (
				<div
					data-theme={theme === 'dark' ? 'dark' : undefined}
					style={{
						background: 'var(--nok-color-background-canvas)',
						padding: '1rem',
						display: 'inline-block',
					}}>
					<Story />
				</div>
			);
		},
	],
};

export default preview;
