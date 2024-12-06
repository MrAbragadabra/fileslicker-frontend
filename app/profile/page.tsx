'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form' // Импортируем компоненты для формы
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table' // Импортируем компоненты для таблицы
import { z } from 'zod' // Импортируем библиотеку для валидации

import { Button } from '@/components/ui/button' // Импортируем компонент кнопки
import { Input } from '@/components/ui/input' // Импортируем компонент ввода
import { toast } from '@/hooks/use-toast' // Импортируем хук для уведомлений
import {
	deleteUpload,
	deleteUser,
	editUser,
	getUploads,
	getUser,
} from '@/lib/api' // Импортируем функции для работы с API
import { zodResolver } from '@hookform/resolvers/zod' // Импортируем решение для интеграции Zod с react-hook-form
import { LoaderCircle } from 'lucide-react' // Импортируем иконку загрузки
import Link from 'next/link' // Импортируем Link для навигации
import { useRouter } from 'next/navigation' // Хук для навигации в Next.js
import { useEffect, useState } from 'react' // Хук для работы с состоянием и эффектами
import { useForm } from 'react-hook-form' // Хук для работы с формами

interface Upload {
	id: number
	user_id: number
	expiration_date: string
	is_deleted: boolean
}

export default function Profile() {
	const router = useRouter() // Хук для навигации в Next.js
	const [loading, setLoading] = useState(false) // Состояние для отслеживания загрузки
	const [uploads, setUploads] = useState<Upload[]>([]) // Состояние для хранения загрузок
	const [userId, setUserId] = useState<number | null>(null) // Состояние для хранения ID пользователя

	// Схема валидации формы
	const formSchema = z.object({
		email: z.string().email({ message: 'Введите корректную почту' }).trim(), // Валидация email
		name: z
			.string()
			.min(2, { message: 'Имя должно быть больше 2 символов' }) // Валидация имени
			.max(50, { message: 'Имя должно быть не больше 50 символов' })
			.trim(),
	})

	// Хук для работы с формой
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema), // Используем Zod для валидации формы
		defaultValues: {
			email: '',
			name: '',
		},
	})

	// Загружаем данные пользователя и его загрузки при монтировании компонента
	useEffect(() => {
		const getUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				try {
					// Получаем данные пользователя
					const userData = await getUser(token)

					form.setValue('email', userData.email || '') // Заполняем форму данными пользователя
					form.setValue('name', userData.name || '')
					setUserId(userData.id) // Устанавливаем ID пользователя

					// Получаем список загрузок пользователя
					const uploadsData = await getUploads(token, userData.id)
					setUploads(uploadsData)
				} catch (error) {
					console.error(error)
					toast({
						title: 'Ошибка загрузки данных',
					})
				}
			}
		}

		getUserData()
	}, [form])

	// Обработка отправки формы
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true) // Включаем состояние загрузки

		const token = localStorage.getItem('token')

		if (token && userId) {
			try {
				const newUserData = {
					id: userId,
					name: values.name, // Обновляем имя пользователя
				}
				await editUser(newUserData, token) // Отправляем запрос на изменение данных пользователя

				toast({
					title: 'Пользователь успешно изменён!',
				})
			} catch {
				toast({
					title: 'Ошибка изменения профиля!',
				})
			} finally {
				setLoading(false) // Завершаем загрузку
			}
		}
	}

	// Обработка удаления пользователя
	const deleteUserClick = async () => {
		const token = localStorage.getItem('token')

		if (!token) {
			toast({
				title: 'Ошибка',
				description: 'Вы не авторизованы!',
			})
			return
		}

		if (
			!confirm(
				'Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.'
			)
		) {
			return
		}

		setLoading(true)

		try {
			await deleteUser(token) // Выполняем запрос на удаление пользователя

			localStorage.removeItem('token') // Удаляем токен из localStorage
			window.dispatchEvent(new Event('storage')) // Обновляем навигацию
			toast({
				title: 'Аккаунт удалён',
				description: 'Ваш аккаунт успешно удалён.',
			})

			router.push('/') // Перенаправляем на главную страницу
		} catch (error) {
			console.error(error)
			toast({
				title: 'Ошибка удаления',
				description: 'Не удалось удалить аккаунт. Попробуйте позже.',
			})
		} finally {
			setLoading(false) // Завершаем загрузку
		}
	}

	// Обработка удаления загрузки
	const handleDeleteUpload = async (id: number) => {
		const token = localStorage.getItem('token')

		if (!token) {
			toast({
				title: 'Ошибка',
				description: 'Вы не авторизованы!',
			})
			return
		}

		try {
			await deleteUpload(id, token) // Удаляем загрузку по ID и токену

			toast({
				title: 'Успех',
				description: `Загрузка с ID ${id} удалена.`,
			})

			// Обновляем список загрузок
			const updatedUploads = await getUploads(token, userId!)
			setUploads(updatedUploads)
		} catch (error) {
			console.error(error)
			toast({
				title: 'Ошибка удаления',
				description: 'Не удалось удалить загрузку. Попробуйте позже.',
			})
		}
	}

	return (
		<>
			{/* Управление загрузками */}
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
					{uploads.map(upload => (
						<TableRow key={upload.id}>
							<TableCell>{upload.id}</TableCell>
							<TableCell>
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
								<Link href={`/upload/${upload.id}`} passHref>
									<Button variant={'outline'}>Перейти</Button>
								</Link>
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
			{/* Личная информация пользователя */}
			<p className='font-bold text-2xl mb-4'>Личная информация</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)} // Обработчик отправки формы
					className='space-y-4 w-full'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Почта</FormLabel>
								<FormControl>
									<Input {...field} disabled />{' '}
									{/* Поле для почты, доступно только для чтения */}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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

					<Button
						onClick={deleteUserClick} // Обработчик удаления аккаунта
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
