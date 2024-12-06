'use client'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import {
	getUsersAdmin,
	userBlock,
	userGrantAdmin,
	userRevokeAdmin,
	userUnblock,
} from '@/lib/api'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function UsersPage() {
	const [users, setUsers] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [actionLoading, setActionLoading] = useState<number | null>(null)

	// Получение данных пользователей
	useEffect(() => {
		const fetchUsers = async () => {
			const token = localStorage.getItem('token')
			if (token) {
				try {
					const data = await getUsersAdmin(token)
					setUsers(data)
				} catch {
					toast({ title: 'Не удалось загрузить данные о пользователях.' })
				} finally {
					setLoading(false)
				}
			}
		}
		fetchUsers()
	}, [])

	// Обновление пользователя после действия
	const updateUser = async (id: number, updatedData: Partial<any>) => {
		setUsers(prevUsers =>
			prevUsers.map(user =>
				user.id === id ? { ...user, ...updatedData } : user
			)
		)
	}

	// Обработчик назначения/снятия прав администратора
	const handleToggleAdmin = async (id: number, isAdmin: boolean) => {
		setActionLoading(id)
		const token = localStorage.getItem('token')
		if (token) {
			try {
				if (isAdmin) {
					await userRevokeAdmin(token, id)
					toast({ title: 'Права администратора сняты.' })
				} else {
					await userGrantAdmin(token, id)
					toast({ title: 'Назначен администратором.' })
				}
				await updateUser(id, { is_admin: !isAdmin })
			} catch {
				toast({ title: 'Ошибка при изменении прав администратора.' })
			} finally {
				setActionLoading(null)
			}
		}
	}

	// Обработчик блокировки/разблокировки пользователя
	const handleToggleBlock = async (id: number, isBlocked: boolean) => {
		setActionLoading(id)
		const token = localStorage.getItem('token')
		if (token) {
			try {
				if (isBlocked) {
					await userUnblock(token, id)
					toast({ title: 'Пользователь разблокирован.' })
				} else {
					await userBlock(token, id)
					toast({ title: 'Пользователь заблокирован.' })
				}
				await updateUser(id, { is_blocked: !isBlocked })
			} catch {
				toast({ title: 'Ошибка при изменении статуса блокировки.' })
			} finally {
				setActionLoading(null)
			}
		}
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Пользователи</h2>

			{/* Таблица */}
			{loading ? (
				<div className='flex justify-center'>
					<LoaderCircle className='animate-spin' />
				</div>
			) : (
				<Table className='min-w-full'>
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
										{/* Кнопка Назначить/Снять Админа */}
										<Button
											variant='outline'
											disabled={user.is_blocked || actionLoading === user.id}
											onClick={() => handleToggleAdmin(user.id, user.is_admin)}
										>
											{actionLoading === user.id ? (
												<LoaderCircle className='animate-spin' />
											) : user.is_admin ? (
												'Снять Админа'
											) : (
												'Назначить Админом'
											)}
										</Button>

										{/* Кнопка Заблокировать/Разблокировать */}
										<Button
											variant='destructive'
											disabled={actionLoading === user.id}
											onClick={() =>
												handleToggleBlock(user.id, user.is_blocked)
											}
										>
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
