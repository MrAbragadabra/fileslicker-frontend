import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'

interface Props {
	className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
	return (
		<>
			<header
				className={cn(
					'sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14',
					className
				)}
			>
				<div className='container px-6 flex h-14 max-w-screen-2xl items-center justify-between'>
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
								<Link
									className='transition-colors hover:text-foreground/80 text-foreground/60'
									href={'/signup'}
								>
									Регистрация
								</Link>
								<Link
									className='transition-colors hover:text-foreground/80 text-foreground/60'
									href={'/login'}
								>
									Вход
								</Link>
							</div>

							{/* Мобильное меню */}
							<div className='flex sm:hidden'>
								<Sheet>
									<SheetTrigger>
										<ChevronDown />
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
													<span className='font-bold text-xl block'>fileslicker</span>
												</Link>
											</SheetTitle>
											<SheetDescription>
												<div className='flex flex-col gap-4 mt-6'>
													<div>
														<Link
															className='transition-colors hover:text-foreground/80 text-foreground/60 text-xl'
															href={'/signup'}
														>
															Регистрация
														</Link>
													</div>
													<div>
														<Link
															className='transition-colors hover:text-foreground/80 text-foreground/60 text-xl'
															href={'/login'}
														>
															Вход
														</Link>
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
