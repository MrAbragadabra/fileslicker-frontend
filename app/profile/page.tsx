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

interface Upload {
	id: number
	user_id: number
	expiration_date: string
	is_deleted: boolean
}

export default function Profile() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [uploads, setUploads] = useState<Upload[]>([])
	const [userId, setUserId] = useState<number | null>(null)

	const formSchema = z.object({
		email: z.string().email({ message: 'Введите корректную почту' }).trim(),
		name: z
			.string()
			.min(2, { message: 'Имя должно быть больше 2 символов' })
			.max(50, { message: 'Имя должно быть не больше 50 символов' })
			.trim(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			name: '',
		},
	})

	useEffect(() => {
		const getUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				try {
					const userData = await getUser(token)

					form.setValue('email', userData.email || '')
					form.setValue('name', userData.name || '')
					setUserId(userData.id)

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

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true)

		const token = localStorage.getItem('token')

		if (token && userId) {
			try {
				const newUserData = {
					id: userId,
					name: values.name,
				}
				await editUser(newUserData, token)

				toast({
					title: 'Пользователь успешно изменён!',
				})
			} catch {
				toast({
					title: 'Ошибка изменения профиля!',
				})
			} finally {
				setLoading(false)
			}
		}
	}

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

			localStorage.removeItem('token') // Удаляем токен
			window.dispatchEvent(new Event('storage')) // Обновляем навигационное меню
			toast({
				title: 'Аккаунт удалён',
				description: 'Ваш аккаунт успешно удалён.',
			})

			router.push('/') // Перенаправляем на главную
		} catch (error) {
			console.error(error)
			toast({
				title: 'Ошибка удаления',
				description: 'Не удалось удалить аккаунт. Попробуйте позже.',
			})
		} finally {
			setLoading(false)
		}
	}

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
			console.log(token)
			console.log(id)
			await deleteUpload(id, token) // Передаем только id и токен

			toast({
				title: 'Успех',
				description: `Загрузка с ID ${id} удалена.`,
			})

			// Обновляем таблицу после удаления
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
			<p className='font-bold text-2xl mb-4'>Личная информация</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4 w-full'
				>
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
