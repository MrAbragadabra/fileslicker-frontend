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

const formSchema = z.object({
	email: z.string().email({ message: 'Введите корректную почту' }).trim(),
	password: z
		.string()
		.min(8, { message: 'пароль должен быть минимум 8 символов' })
		.max(128, { message: 'пароль должен быть максимум 128 символов' })
		.trim(),
})

interface LoginFormProps {
	DialogTriggerClassName?: string
	onClick?: () => void
}

export default function LoginForm({
	DialogTriggerClassName,
	onClick,
}: LoginFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast({
			title: 'Успешный вход',
			description: `Пользователь ${values.email} успешно вошёл в систему!`,
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
					Вход
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Авторизация</DialogTitle>
						<DialogDescription>
							После регистрации можно войти на сайт :3
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
								<Button className='w-full' variant={'default'} type='submit'>
									Войти
								</Button>
							</form>
						</Form>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	)
}
