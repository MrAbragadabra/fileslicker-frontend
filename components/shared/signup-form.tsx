'use client'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
	.object({
		email: z.string().email({ message: 'Введите корректную почту' }).trim(),
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

interface SignupFormProps {
	DialogTriggerClassName?: string
	onClick?: () => void
}

export default function SignupForm({
	DialogTriggerClassName,
	onClick,
}: SignupFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			password_repeat: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast({
			title: 'Успешная регистрация',
			description: `Пользователь ${values.email} успешно зарегистрирован!`,
		})
	}

	return (
		<div>
			<Dialog>
				<DialogTrigger
					onClick={onClick}
					className={
						DialogTriggerClassName ||
						'transition-colors hover:text-foreground/80 text-foreground/60'
					}
				>
					Регистрация
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Регистрация</DialogTitle>
						<DialogDescription>
							Для того, чтобы получить больше функций, нужно пройти регистрацию
						</DialogDescription>
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
								<Button className='w-full' variant={'default'} type='submit'>
									Создать аккаунт
								</Button>
							</form>
						</Form>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	)
}
