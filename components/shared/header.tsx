'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import LoginForm from './login-form'
import SignupForm from './signup-form'
import { ThemeSwitcher } from './theme-switcher'

interface Props {
	className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
	const [isOpen, setIsOpen] = useState(false)

	const handleClose = () => {
		setIsOpen(false)
		toast({
			title: 'Нажатие!',
			description: 'Вы нажали на кнопку! Поздравляем!',
		})
	}

	return (
		<>
			<header
				className={cn(
					'sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14',
					className
				)}
			>
				<div className='px-6 flex h-14 w-full items-center justify-between'>
					{/* Название и логотип */}
					<div className='flex items-center'>
						<Link className='flex items-center mr-4' href={'/'}>
							<svg
								className='h-6 w-6 mr-2'
								viewBox='0 0 139 139'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<circle
									className='dark:stroke-white stroke-black'
									cx='68'
									cy='68'
									r='60'
									stroke='white'
									strokeWidth='11'
								/>
							</svg>
							<span className='font-bold text-xl'>fileslicker</span>
						</Link>
					</div>

					<div className='flex items-center'>
						<nav className='mr-4 items-center'>
							{/* Десктопное меню */}
							<div className='hidden sm:flex gap-4'>
								<Dialog>
									<DialogTrigger className='transition-colors hover:text-foreground/80 text-foreground/60'>
										Регистрация
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Регистрация</DialogTitle>
											<DialogDescription>
												Для того, чтобы получить больше функций, нужно пройти
												регистрацию
											</DialogDescription>
											<SignupForm />
										</DialogHeader>
									</DialogContent>
								</Dialog>

								<Dialog>
									<DialogTrigger className='transition-colors hover:text-foreground/80 text-foreground/60'>
										Вход
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Авторизация</DialogTitle>
											<DialogDescription>
												После регистрации можно войти на сайт :3
											</DialogDescription>
											<LoginForm />
										</DialogHeader>
									</DialogContent>
								</Dialog>
							</div>

							{/* Мобильное меню */}
							<div className='flex sm:hidden'>
								<Sheet open={isOpen} onOpenChange={setIsOpen}>
									<SheetTrigger>
										<ChevronDown onClick={() => setIsOpen(true)} />
									</SheetTrigger>
									<SheetContent side={'left'}>
										<SheetHeader>
											<SheetTitle>
												<Link className='flex items-center' href={'/'}>
													<svg
														className='h-6 w-6 mr-2 block'
														viewBox='0 0 139 139'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<circle
															className='dark:stroke-white stroke-black'
															cx='68'
															cy='68'
															r='60'
															stroke='white'
															strokeWidth='11'
														/>
													</svg>
													<span className='font-bold text-xl block'>
														fileslicker
													</span>
												</Link>
											</SheetTitle>
											<SheetDescription>
												<div className='flex-col gap-6 mt-6'>
													<div>
														<div>
															<p
																onClick={handleClose}
																className='cursor-pointer transition-colors hover:text-foreground/80 text-foreground/60 text-xl'
															>
																Регистрация
															</p>
														</div>

														<div>
															<p
																onClick={handleClose}
																className='cursor-pointer transition-colors hover:text-foreground/80 text-foreground/60 text-xl'
															>
																Вход
															</p>
														</div>
													</div>
												</div>
											</SheetDescription>
										</SheetHeader>
									</SheetContent>
								</Sheet>
							</div>
						</nav>

						<ThemeSwitcher />
					</div>
				</div>
			</header>
		</>
	)
}
