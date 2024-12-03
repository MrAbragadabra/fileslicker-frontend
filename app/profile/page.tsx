'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { editUser, getUser } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Profile() {
	interface User {
		id: number
		name: string
	}
	const [loading, setLoading] = useState(false)

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

	// Загружаем пользователя и устанавливаем значения формы
	useEffect(() => {
		const getUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				try {
					const userData = await getUser(token)

					// Устанавливаем значения в форму
					form.setValue('email', userData.email || '')
					form.setValue('name', userData.name || '')
				} catch {}
			}
		}

		getUserData()
	}, [form])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true)

		const token = localStorage.getItem('token')
		let currentUser

		if (token) {
			try {
				currentUser = await getUser(token)
				toast({
					title: 'Пользователь успешно изменён!',
				})
				setLoading(false)
			} catch {
				setLoading(false)
				toast({
					title: 'Ошибка изменения профиля!',
				})
			}
		}

		const newUserData: User = {
			name: values.name,
			id: currentUser.id,
		}

		if (token) {
			try {
				await editUser(newUserData, token)
			} catch {}
		}
	}

	return (
		<>
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
		</>
	)
}
