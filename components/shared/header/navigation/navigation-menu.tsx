import { NavigationElement } from './navigation-element'

export const NavigationMenu = ({}) => {
	return (
		<nav className='space-x-6'>
			<NavigationElement href='/signup' caption='Создание аккаунта' />
			<NavigationElement href='/login' caption='Вход' />
		</nav>
	)
}
