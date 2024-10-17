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

export default function Login() {
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
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-4 w-full lg:max-w-[30%]'
			>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Почта</FormLabel>
							<FormControl>
								<Input placeholder='ваша электронная почта' {...field} />
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
								<Input
									type='password'
									placeholder='использовали при регистрации'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button variant={'outline'} type='submit'>
					Войти
				</Button>
			</form>
		</Form>
	)
}