'use client'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { getUser } from '@/lib/api'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginForm } from '../../forms/login'
import { SignUpForm } from '../../forms/signup'
import { Logo } from '../logo'
import { NavigationElement } from './navigation-element'

interface Props {
	className?: string
}

export const MobileMenu = ({ className }: Props) => {
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

	const logout = () => {
		localStorage.removeItem('token')
		fetchUserStatus()
		router.push('/')
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
		<div className={className}>
			<Sheet>
				<SheetTrigger>
					<ChevronDown />
				</SheetTrigger>
				<SheetContent side={'left'}>
					<SheetHeader>
						<SheetTitle>
							<Logo />
						</SheetTitle>
						<SheetDescription>
							<div className='mt-6 space-y-6 flex-col text-xl'>
								{userStatus === 'guest' && (
									<>
										<SignUpForm />
										<LoginForm />
									</>
								)}

								{userStatus === 'user' && (
									<NavigationElement
										className='block'
										href='/profile'
										caption='Профиль'
										type='link'
									/>
								)}

								{userStatus === 'admin' && (
									<NavigationElement
										className='block'
										href='/dashboard'
										caption='Панель управления'
										type='link'
									/>
								)}

								{(userStatus === 'admin' || userStatus === 'user') && (
									<NavigationElement
										className='block'
										onClick={logout}
										caption='Выйти'
										type='text'
									/>
								)}
							</div>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	)
}
