import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { TableRow, TableRowProps } from './table-row.js';
import { TableCell } from './table-cell.js';
import { Icon } from '../icons/Icon.js';

interface TableRowStoryProps extends TableRowProps {
	theme?: 'light' | 'dark';
}

const TableRowWithTheme = ({ theme = 'light', ...props }: TableRowStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<TableRow {...props} />
	</div>
);

const meta = {
	title: 'Components/Table/TableRow',
	component: TableRowWithTheme,
	tags: ['autodocs'],
	argTypes: {
		state: {
			control: 'select',
			options: ['default', 'hover', 'selected', 'selected-hover', 'disabled'],
		},
		showCheckbox: {
			control: 'boolean',
		},
		checked: {
			control: 'boolean',
		},
		showHoverActions: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		state: 'default',
		showCheckbox: true,
		checked: false,
		showHoverActions: true,
		theme: 'light',
	},
	render: (args) => {
		const [, updateArgs] = useArgs();
		return (
			<TableRowWithTheme
				{...args}
				onCheckedChange={(checked) => updateArgs({ checked })}
				hoverActions={
					<button type='button' aria-label='Row actions' className='inline-flex'>
						<Icon name='MoreHorizontal' size='sm' color='default' />
					</button>
				}>
				<TableCell
					columnType='person'
					value='Jordan Doe'
					avatarType='image'
					avatarSrc='https://i.pravatar.cc/150?img=12'
				/>
				<TableCell columnType='text' value='Engineering' />
				<TableCell columnType='text' value='Remote' />
				<TableCell columnType='text' value='Full-time' />
				<TableCell columnType='status' badgeVariant='success' badgeAppearance='filled' badgeLabel='Active' />
			</TableRowWithTheme>
		);
	},
} satisfies Meta<typeof TableRowWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
