import { ThemeSwitcher } from '@/components/shared/theme-switcher'

export default function Home() {
	return (
		<div className='flex items-center select-none'>
			<h1 className='mr-5 text-4xl'>Fileslicker</h1>
			<ThemeSwitcher />
		</div>
	)
}
