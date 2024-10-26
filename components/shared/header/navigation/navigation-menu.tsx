import { cn } from '@/lib/utils'
import { NavigationElement } from './navigation-element'

interface Props {
	className?: string
}

export const NavigationMenu = ({ className }: Props) => {
	return (
		<nav className={cn(className, 'space-x-6')}>
			<NavigationElement type='text' caption='Создание аккаунта' />
			<NavigationElement type='text' caption='Вход' />
		</nav>
	)
}
