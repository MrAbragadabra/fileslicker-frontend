'use client'

import { Button } from '@/components/ui/button' // Импорт компонента кнопки
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table' // Импорт компонентов для таблицы
import { toast } from '@/hooks/use-toast' // Импорт хука для уведомлений
import {
	getUsersAdmin,
	userBlock,
	userGrantAdmin,
	userRevokeAdmin,
	userUnblock,
} from '@/lib/api' // Импорт функций для работы с API
import { LoaderCircle } from 'lucide-react' // Импорт иконки загрузки
import { useEffect, useState } from 'react' // Импорт хуков для состояния и эффекта

export default function UsersPage() {
	// Состояние для списка пользователей, загрузки и состояния действия
	const [users, setUsers] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [actionLoading, setActionLoading] = useState<number | null>(null)

	// Загрузка данных пользователей при монтировании компонента
	useEffect(() => {
		const fetchUsers = async () => {
			const token = localStorage.getItem('token') // Получаем токен пользователя
			if (token) {
				try {
					const data = await getUsersAdmin(token) // Получаем список пользователей
					setUsers(data)
				} catch {
					toast({ title: 'Не удалось загрузить данные о пользователях.' }) // Ошибка загрузки
				} finally {
					setLoading(false) // Завершаем загрузку данных
				}
			}
		}
		fetchUsers()
	}, [])

	// Обновление данных пользователя в списке
	const updateUser = async (id: number, updatedData: Partial<any>) => {
		setUsers(prevUsers =>
			prevUsers.map(user =>
				user.id === id ? { ...user, ...updatedData } : user
			)
		)
	}

	// Обработчик назначения или снятия прав администратора
	const handleToggleAdmin = async (id: number, isAdmin: boolean) => {
		setActionLoading(id) // Устанавливаем загрузку для действия пользователя
		const token = localStorage.getItem('token')
		if (token) {
			try {
				if (isAdmin) {
					await userRevokeAdmin(token, id) // Снимаем права администратора
					toast({ title: 'Права администратора сняты.' })
				} else {
					await userGrantAdmin(token, id) // Назначаем пользователя администратором
					toast({ title: 'Назначен администратором.' })
				}
				await updateUser(id, { is_admin: !isAdmin }) // Обновляем данные пользователя
			} catch {
				toast({ title: 'Ошибка при изменении прав администратора.' })
			} finally {
				setActionLoading(null) // Завершаем действие
			}
		}
	}

	// Обработчик блокировки или разблокировки пользователя
	const handleToggleBlock = async (id: number, isBlocked: boolean) => {
		setActionLoading(id) // Устанавливаем загрузку для действия пользователя
		const token = localStorage.getItem('token')
		if (token) {
			try {
				if (isBlocked) {
					await userUnblock(token, id) // Разблокируем пользователя
					toast({ title: 'Пользователь разблокирован.' })
				} else {
					await userBlock(token, id) // Блокируем пользователя
					toast({ title: 'Пользователь заблокирован.' })
				}
				await updateUser(id, { is_blocked: !isBlocked }) // Обновляем данные пользователя
			} catch {
				toast({ title: 'Ошибка при изменении статуса блокировки.' })
			} finally {
				setActionLoading(null) // Завершаем действие
			}
		}
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Пользователи</h2>

			{/* Отображение загрузки, если данные еще не получены */}
			{loading ? (
				<div className='flex justify-center'>
					<LoaderCircle className='animate-spin' />
				</div>
			) : (
				<Table className='min-w-full'>
					{/* Заголовок таблицы */}
					<TableHeader>
						<TableRow>
							<TableCell className='font-semibold'>ID</TableCell>
							<TableCell className='font-semibold'>Имя</TableCell>
							<TableCell className='font-semibold'>Email</TableCell>
							<TableCell className='font-semibold'>Администратор</TableCell>
							<TableCell className='font-semibold'>Заблокирован</TableCell>
							<TableCell className='font-semibold'>Действия</TableCell>
						</TableRow>
					</TableHeader>
					{/* Тело таблицы с пользователями */}
					<TableBody>
						{users.map(user => (
							<TableRow key={user.id}>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.is_admin ? 'Да' : 'Нет'}</TableCell>
								<TableCell>{user.is_blocked ? 'Да' : 'Нет'}</TableCell>
								<TableCell>
									<div className='flex space-x-2'>
										{/* Кнопка для назначения/снятия прав администратора */}
										<Button
											variant='outline'
											disabled={user.is_blocked || actionLoading === user.id}
											onClick={() => handleToggleAdmin(user.id, user.is_admin)}
										>
											{/* Показываем загрузку или текст кнопки */}
											{actionLoading === user.id ? (
												<LoaderCircle className='animate-spin' />
											) : user.is_admin ? (
												'Снять Админа'
											) : (
												'Назначить Админом'
											)}
										</Button>

										{/* Кнопка для блокировки/разблокировки пользователя */}
										<Button
											variant='destructive'
											disabled={actionLoading === user.id}
											onClick={() =>
												handleToggleBlock(user.id, user.is_blocked)
											}
										>
											{/* Показываем загрузку или текст кнопки */}
											{actionLoading === user.id ? (
												<LoaderCircle className='animate-spin' />
											) : user.is_blocked ? (
												'Разблокировать'
											) : (
												'Заблокировать'
											)}
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
