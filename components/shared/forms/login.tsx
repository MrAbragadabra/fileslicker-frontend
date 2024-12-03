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
import { loginUser } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavigationElement } from '../header/navigation/navigation-element'

export const LoginForm: React.FC = ({}) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const formSchema = z.object({
		email: z.string().email({ message: 'Введите корректную почту' }).trim(),
		password: z
			.string()
			.min(8, { message: 'пароль должен быть минимум 8 символов' })
			.max(128, { message: 'пароль должен быть максимум 128 символов' })
			.trim(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true)

		try {
			const response = await loginUser({
				email: values.email,
				password: values.password,
			})

			const tokenString = response.token
			const [, token] = tokenString.split('|')

			localStorage.setItem('token', token)

			window.dispatchEvent(new Event('storage'))

			router.push('/profile')
		} catch {
			setLoading(false)

			toast({
				title: 'Упс! Не получилось вас авторизовать!',
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
						caption='Войти'
					/>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Вход</DialogTitle>
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
								<Button
									className='w-full'
									variant={'default'}
									type='submit'
									disabled={loading}
								>
									{loading ? (
										<>
											<LoaderCircle className='animate-spin mr-2' />
											<span>Войти</span>
										</>
									) : (
										'Войти'
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
