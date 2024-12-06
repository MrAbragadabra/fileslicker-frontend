'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import {
	deleteUpload,
	deleteUser,
	editUser,
	getUploads,
	getUser,
} from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Интерфейс для описания структуры данных загрузки
interface Upload {
	id: number
	user_id: number
	expiration_date: string
	is_deleted: boolean
}

export default function Profile() {
	// Хук для маршрутизации в Next.js
	const router = useRouter()
	// Состояние загрузки, чтобы показывать индикатор загрузки
	const [loading, setLoading] = useState(false)
	// Состояние для хранения информации о загрузках пользователя
	const [uploads, setUploads] = useState<Upload[]>([])
	// Состояние для хранения ID пользователя
	const [userId, setUserId] = useState<number | null>(null)

	// Схема валидации с использованием Zod
	const formSchema = z.object({
		email: z.string().email({ message: 'Введите корректную почту' }).trim(),
		name: z
			.string()
			.min(2, { message: 'Имя должно быть больше 2 символов' })
			.max(50, { message: 'Имя должно быть не больше 50 символов' })
			.trim(),
	})

	// Используем useForm для управления формой и валидацией
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			name: '',
		},
	})

	// Эффект для получения данных пользователя при загрузке компонента
	useEffect(() => {
		const getUserData = async () => {
			// Получаем токен из локального хранилища
			const token = localStorage.getItem('token')

			// Если токен существует, выполняем запросы
			if (token) {
				try {
					// Получаем данные пользователя
					const userData = await getUser(token)

					// Устанавливаем полученные данные в форму
					form.setValue('email', userData.email || '')
					form.setValue('name', userData.name || '')
					setUserId(userData.id)

					// Получаем загрузки пользователя
					const uploadsData = await getUploads(token, userData.id)
					setUploads(uploadsData)
				} catch (error) {
					console.error(error)
					// В случае ошибки выводим уведомление
					toast({
						title: 'Ошибка загрузки данных',
					})
				}
			}
		}

		// Вызов функции для получения данных пользователя
		getUserData()
	}, [form])

	// Функция для обработки отправки формы
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true)

		// Получаем токен из локального хранилища
		const token = localStorage.getItem('token')

		// Если токен и userId существуют, выполняем обновление данных пользователя
		if (token && userId) {
			try {
				const newUserData = {
					id: userId,
					name: values.name,
				}
				// Запрос на обновление данных пользователя
				await editUser(newUserData, token)

				// Уведомление об успешном изменении
				toast({
					title: 'Пользователь успешно изменён!',
				})
			} catch {
				// Уведомление об ошибке
				toast({
					title: 'Ошибка изменения профиля!',
				})
			} finally {
				setLoading(false)
			}
		}
	}

	// Функция для обработки удаления аккаунта
	const deleteUserClick = async () => {
		const token = localStorage.getItem('token')

		// Проверка наличия токена
		if (!token) {
			toast({
				title: 'Ошибка',
				description: 'Вы не авторизованы!',
			})
			return
		}

		// Подтверждение удаления аккаунта
		if (
			!confirm(
				'Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.'
			)
		) {
			return
		}

		setLoading(true)

		// Попытка удаления аккаунта
		try {
			await deleteUser(token) // Выполняем запрос на удаление пользователя

			localStorage.removeItem('token') // Удаляем токен
			window.dispatchEvent(new Event('storage')) // Обновляем навигационное меню
			toast({
				title: 'Аккаунт удалён',
				description: 'Ваш аккаунт успешно удалён.',
			})

			router.push('/') // Перенаправляем на главную
		} catch (error) {
			console.error(error)
			// Уведомление об ошибке удаления
			toast({
				title: 'Ошибка удаления',
				description: 'Не удалось удалить аккаунт. Попробуйте позже.',
			})
		} finally {
			setLoading(false)
		}
	}

	// Функция для обработки удаления загрузки
	const handleDeleteUpload = async (id: number) => {
		const token = localStorage.getItem('token')

		// Проверка наличия токена
		if (!token) {
			toast({
				title: 'Ошибка',
				description: 'Вы не авторизованы!',
			})
			return
		}

		try {
			// Запрос на удаление загрузки
			await deleteUpload(id, token)

			// Уведомление об успешном удалении
			toast({
				title: 'Успех',
				description: `Загрузка с ID ${id} удалена.`,
			})

			// Обновляем таблицу после удаления
			const updatedUploads = await getUploads(token, userId!)
			setUploads(updatedUploads)
		} catch (error) {
			console.error(error)
			// Уведомление об ошибке удаления
			toast({
				title: 'Ошибка удаления',
				description: 'Не удалось удалить загрузку. Попробуйте позже.',
			})
		}
	}

	return (
		<>
			<p className='font-bold text-2xl mb-4'>Управление загрузками</p>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Дата истечения</TableHead>
						<TableHead>Удален</TableHead>
						<TableHead>Действия</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* Перебираем все загрузки и выводим их в таблицу */}
					{uploads.map(upload => (
						<TableRow key={upload.id}>
							<TableCell>{upload.id}</TableCell>
							<TableCell>
								{/* Форматируем дату истечения */}
								{new Date(upload.expiration_date).toLocaleString('ru-RU', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit',
								})}
							</TableCell>
							<TableCell>{upload.is_deleted ? 'Да' : 'Нет'}</TableCell>
							<TableCell className='flex space-x-2'>
								{/* Ссылка на страницу загрузки */}
								<Link href={`/upload/${upload.id}`} passHref>
									<Button variant={'outline'}>Перейти</Button>
								</Link>
								{/* Кнопка для удаления загрузки */}
								<Button
									variant={'destructive'}
									onClick={() => handleDeleteUpload(upload.id)}
								>
									Удалить
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<hr className='my-4' />
			<p className='font-bold text-2xl mb-4'>Личная информация</p>
			{/* Форма для редактирования личных данных */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4 w-full'
				>
					{/* Поле для почты, которое нельзя редактировать */}
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Почта</FormLabel>
								<FormControl>
									<Input {...field} disabled />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Поле для имени */}
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Кнопка для отправки формы */}
					<Button
						className='w-full'
						variant={'default'}
						type='submit'
						disabled={loading}
					>
						{loading ? (
							<>
								<LoaderCircle className='animate-spin mr-2' />
								<span>Редактировать аккаунт</span>
							</>
						) : (
							'Редактировать аккаунт'
						)}
					</Button>

					{/* Кнопка для удаления аккаунта */}
					<Button
						onClick={deleteUserClick}
						className='w-full'
						variant={'destructive'}
						disabled={loading}
					>
						{loading ? (
							<>
								<LoaderCircle className='animate-spin mr-2' />
								<span>Удаление...</span>
							</>
						) : (
							'Удалить аккаунт'
						)}
					</Button>
				</form>
			</Form>
		</>
	)
}
