import { Button } from '@nokgridcore/ui/button';
import styles from './page.module.css';

export default function Home() {
	return (
		<div className={styles.page}>
			<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
				<Button variant='primary'>Primary</Button>
				<Button variant='secondary'>Secondary</Button>
				<Button variant='tertiary'>Tertiary</Button>
				<Button variant='destructive'>Destructive</Button>
			</div>
			<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
				<Button state="disabled" variant='primary'>
					Primary Disabled
				</Button>
				<Button state="disabled" variant='secondary'>
					Secondary Disabled
				</Button>
				<Button state="disabled" variant='tertiary'>
					Tertiary Disabled
				</Button>
				<Button state="disabled" variant='destructive'>
					Destructive Disabled
				</Button>
			</div>
		</div>
	);
}
