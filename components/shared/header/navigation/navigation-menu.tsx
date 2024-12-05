'use client'
import { toast } from '@/hooks/use-toast'
import { getUser, logoutUser } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginForm } from '../../forms/login'
import { SignUpForm } from '../../forms/signup'
import { NavigationElement } from './navigation-element'

interface Props {
	className?: string
}

export const NavigationMenu = ({ className }: Props) => {
	const router = useRouter()
	const [userStatus, setUserStatus] = useState<'guest' | 'user' | 'admin'>(
		'guest'
	)

	const fetchUserStatus = async () => {
		const token = localStorage.getItem('token') // Получаем токен из localStorage
		if (token) {
			try {
				const userData = await getUser(token) // Получаем данные пользователя
				if (userData?.is_admin) {
					setUserStatus('admin') // Пользователь с правами администратора
				} else {
					setUserStatus('user') // Просто пользователь
				}
			} catch {
				setUserStatus('guest') // Если ошибка в запросе — считаем пользователя гостем
			}
		} else {
			setUserStatus('guest') // Нет токена — гость
		}
	}

	const logout = async () => {
		const token = localStorage.getItem('token')

		if (token) {
			await logoutUser(token)

			localStorage.removeItem('token')

			fetchUserStatus()
			router.push('/')
		} else {
			toast({
				title: 'Что-то пошло не так при входе!',
			})
		}
	}

	useEffect(() => {
		fetchUserStatus()
		// Слушаем изменение токена в localStorage
		const handleStorageChange = () => {
			fetchUserStatus()
		}

		window.addEventListener('storage', handleStorageChange)

		// Очистка события при демонтировании компонента
		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, []) // Запрашиваем статус при монтировании компонента

	return (
		<nav className={cn(className, 'space-x-6')}>
			{userStatus === 'guest' && (
				<>
					<SignUpForm />
					<LoginForm />
				</>
			)}

			{userStatus === 'user' && (
				<NavigationElement href='/profile' caption='Профиль' type='link' />
			)}

			{userStatus === 'admin' && (
				<NavigationElement
					href='/dashboard'
					caption='Панель управления'
					type='link'
				/>
			)}

			{(userStatus === 'admin' || userStatus === 'user') && (
				<NavigationElement onClick={logout} caption='Выйти' type='text' />
			)}
		</nav>
	)
}
