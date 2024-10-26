import { NavigationElement } from './navigation-element'

export const NavigationMenu = ({}) => {
	return (
		<nav className='space-x-6'>
			<NavigationElement type='text' caption='Создание аккаунта' />
			<NavigationElement type='text' caption='Вход' />
		</nav>
	)
}
