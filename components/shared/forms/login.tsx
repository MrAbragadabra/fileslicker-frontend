'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form' // Импортируем компоненты для формы
import { z } from 'zod' // Импортируем библиотеку для схем валидации

import { Button } from '@/components/ui/button' // Импортируем компонент кнопки
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog' // Импортируем компоненты для диалогового окна
import { Input } from '@/components/ui/input' // Импортируем компонент ввода
import { toast } from '@/hooks/use-toast' // Импортируем хук для уведомлений
import { loginUser } from '@/lib/api' // Импортируем функцию для авторизации пользователя
import { zodResolver } from '@hookform/resolvers/zod' // Импортируем решение для интеграции Zod с react-hook-form
import { LoaderCircle } from 'lucide-react' // Импортируем иконку загрузки
import { useRouter } from 'next/navigation' // Импортируем хук для навигации
import { useState } from 'react' // Импортируем useState для состояния компонента
import { useForm } from 'react-hook-form' // Импортируем хук для работы с формами
import { NavigationElement } from '../header/navigation/navigation-element' // Импортируем компонент для навигации

export const LoginForm: React.FC = ({}) => {
	const router = useRouter() // Хук для навигации в Next.js
	const [loading, setLoading] = useState(false) // Состояние для отслеживания загрузки

	// Схема валидации с использованием Zod
	const formSchema = z.object({
		email: z.string().email({ message: 'Введите корректную почту' }).trim(), // Валидация для email
		password: z
			.string()
			.min(8, { message: 'пароль должен быть минимум 8 символов' }) // Валидация для пароля
			.max(128, { message: 'пароль должен быть максимум 128 символов' })
			.trim(),
	})

	// Используем useForm для работы с формой
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema), // Используем Zod для валидации формы
		defaultValues: {
			email: '',
			password: '',
		},
	})

	// Функция для обработки отправки формы
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true) // Включаем состояние загрузки

		try {
			// Попытка авторизации пользователя через API
			const response = await loginUser({
				email: values.email,
				password: values.password,
			})

			// Получаем токен из ответа и сохраняем его в localStorage
			const tokenString = response.token
			const [, token] = tokenString.split('|')

			localStorage.setItem('token', token)

			// Генерируем событие, чтобы другие части приложения могли отреагировать
			window.dispatchEvent(new Event('storage'))

			console.log(response.user.is_admin) // Логируем роль пользователя (для отладки)

			toast({
				title: 'Вы успешно авторизованы!', // Уведомление об успешной авторизации
			})

			// Проверяем роль пользователя и перенаправляем его в соответствующий раздел
			if (response.user.is_admin === true) {
				router.push('/dashboard') // Редирект для администратора
			} else {
				router.push('/profile') // Редирект для обычного пользователя
			}
		} catch {
			setLoading(false) // Завершаем загрузку в случае ошибки

			// Уведомление об ошибке авторизации
			toast({
				title: 'Упс! Не получилось вас авторизовать!',
			})
		}
	}

	return (
		<div>
			{/* Диалоговое окно для формы входа */}
			<Dialog>
				<DialogTrigger>
					{/* Кнопка для открытия диалогового окна */}
					<NavigationElement
						className='block font-bold transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer'
						type='text'
						caption='Войти'
					/>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Вход</DialogTitle>
						<DialogDescription></DialogDescription>
						{/* Форма для входа */}
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)} // Обработчик отправки формы
								className='space-y-4 w-full'
							>
								{/* Поле для email */}
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Почта</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Поле для пароля */}
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Пароль</FormLabel>
											<FormControl>
												<Input type='password' {...field} />
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
									disabled={loading} // Отключаем кнопку при загрузке
								>
									{loading ? (
										<>
											{/* Иконка загрузки во время отправки */}
											<LoaderCircle className='animate-spin mr-2' />
											<span>Войти</span>
										</>
									) : (
										'Войти' // Текст кнопки
									)}
								</Button>
							</form>
						</Form>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	)
}
