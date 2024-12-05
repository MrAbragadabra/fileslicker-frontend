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
import { editUser, getUploads, getUser } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link' // Импортируем Link из next/link
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Upload {
	id: number
	user_id: number
	expiration_date: string
	is_deleted: boolean
}

export default function Profile() {
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

	// Загружаем пользователя и значения формы
	useEffect(() => {
		const getUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				try {
					const userData = await getUser(token)

					// Устанавливаем значения в форму
					form.setValue('email', userData.email || '')
					form.setValue('name', userData.name || '')
					setUserId(userData.id)

					// Загружаем загрузки пользователя
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

	const deleteUser = async () => {
		toast({
			title: 'Вы не были удалены, потому что это просто кнопка',
		})
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
						<TableHead>Действие</TableHead>
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
							<TableCell>
								{/* Используем Link вместо Button с as="a" */}
								<Link href={`/upload/${upload.id}`} passHref>
									<Button className='w-full' variant={'outline'}>
										Перейти
									</Button>
								</Link>
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
								<span>Редактировать профиль</span>
							</>
						) : (
							'Редактировать профиль'
						)}
					</Button>
				</form>
			</Form>
			<Button
				onClick={deleteUser}
				className='my-4 w-full'
				variant={'destructive'}
			>
				Удалить профиль
			</Button>
		</>
	)
}
