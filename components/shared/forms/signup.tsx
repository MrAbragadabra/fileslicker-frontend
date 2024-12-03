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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { signupUser } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavigationElement } from '../header/navigation/navigation-element'

export const SignUpForm: React.FC = ({}) => {
	const [loading, setLoading] = useState(false)

	const formSchema = z
		.object({
			email: z.string().email({ message: 'Введите корректную почту' }).trim(),
			name: z
				.string()
				.min(2, { message: 'имя должно быть больше 2 символов' })
				.max(50, { message: 'имя должно быть не больше 50 символов' })
				.trim(),
			password: z
				.string()
				.min(8, { message: 'пароль должен быть минимум 8 символов' })
				.max(128, { message: 'пароль должен быть максимум 128 символов' })
				.trim(),
			password_repeat: z
				.string()
				.min(8, { message: 'пароль должен быть минимум 8 символов' })
				.max(128, { message: 'пароль должен быть максимум 128 символов' })
				.trim(),
		})
		.superRefine(({ password, password_repeat }, ctx) => {
			if (password_repeat != password) {
				ctx.addIssue({
					code: 'custom',
					message: 'Пароли не совпадают!',
					path: ['password_repeat'],
				})
			}
		})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
			password_repeat: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true)

		try {
			await signupUser({
				name: values.name,
				email: values.email,
				password: values.password,
			})

			setLoading(false)
		} catch {
			setLoading(false)

			toast({
				title: 'Упс! Не получилось вас зарегистрировать!',
			})
		}
	}

	return (
		<div>
			<Dialog>
				<DialogTrigger>
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
												<Input {...field} />
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
								<Button
									className='w-full'
									variant={'default'}
									type='submit'
									disabled={loading}
								>
									{loading ? (
										<>
											<LoaderCircle className='animate-spin mr-2' />
											<span>Создать аккаунт</span>
										</>
									) : (
										'Создать аккаунт'
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
