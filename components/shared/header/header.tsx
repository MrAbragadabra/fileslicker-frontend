import { Logo } from './logo'
import { NavigationMenu } from './navigation/navigation-menu'
import { ThemeSwitcher } from './theme-switcher'

export const Header: React.FC = ({}) => {
	return (
		<header className='h-16 sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='px-6 h-16 flex items-center justify-between'>
				<Logo />
				<div className='flex items-center gap-6 justify-between'>
					<NavigationMenu />
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	)
}
