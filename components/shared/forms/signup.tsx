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
import { signupUser } from '@/lib/api' // Импортируем функцию для регистрации пользователя
import { zodResolver } from '@hookform/resolvers/zod' // Импортируем решение для интеграции Zod с react-hook-form
import { LoaderCircle } from 'lucide-react' // Импортируем иконку загрузки
import { useState } from 'react' // Импортируем useState для состояния компонента
import { useForm } from 'react-hook-form' // Импортируем хук для работы с формами
import { NavigationElement } from '../header/navigation/navigation-element' // Импортируем компонент для навигации

export const SignUpForm: React.FC = ({}) => {
	const [loading, setLoading] = useState(false) // Состояние для отслеживания загрузки

	// Схема валидации с использованием Zod
	const formSchema = z
		.object({
			email: z.string().email({ message: 'Введите корректную почту' }).trim(), // Валидация для email
			name: z
				.string()
				.min(2, { message: 'имя должно быть больше 2 символов' }) // Валидация для имени
				.max(50, { message: 'имя должно быть не больше 50 символов' })
				.trim(),
			password: z
				.string()
				.min(8, { message: 'пароль должен быть минимум 8 символов' }) // Валидация для пароля
				.max(128, { message: 'пароль должен быть максимум 128 символов' })
				.trim(),
			password_repeat: z
				.string()
				.min(8, { message: 'пароль должен быть минимум 8 символов' }) // Валидация для повторного пароля
				.max(128, { message: 'пароль должен быть максимум 128 символов' })
				.trim(),
		})
		.superRefine(({ password, password_repeat }, ctx) => {
			// Проверка совпадения паролей
			if (password_repeat != password) {
				ctx.addIssue({
					code: 'custom',
					message: 'Пароли не совпадают!',
					path: ['password_repeat'],
				})
			}
		})

	// Используем useForm для работы с формой
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema), // Используем Zod для валидации формы
		defaultValues: {
			email: '',
			name: '',
			password: '',
			password_repeat: '',
		},
	})

	// Функция для обработки отправки формы
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true) // Включаем состояние загрузки

		try {
			// Попытка регистрации пользователя через API
			await signupUser({
				name: values.name,
				email: values.email,
				password: values.password,
			})

			setLoading(false) // Завершаем загрузку

			// Уведомление об успешной регистрации
			toast({
				title: 'Вы успешно зарегистрированы!',
			})
		} catch {
			setLoading(false) // Завершаем загрузку

			// Уведомление о неудачной попытке регистрации
			toast({
				title: 'Упс! Не получилось вас зарегистрировать!',
			})
		}
	}

	return (
		<div>
			{/* Диалоговое окно с формой регистрации */}
			<Dialog>
				<DialogTrigger>
					{/* Кнопка для открытия диалогового окна */}
					<NavigationElement
						className='block font-bold transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer'
						type='text'
						caption='Создание аккаунта'
					/>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Регистрация</DialogTitle>
						<DialogDescription></DialogDescription>
						{/* Форма для регистрации */}
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
								{/* Поле для повторного пароля */}
								<FormField
									control={form.control}
									name='password_repeat'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Повтор пароля</FormLabel>
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
											<span>Создать аккаунт</span>
										</>
									) : (
										'Создать аккаунт' // Текст кнопки
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
