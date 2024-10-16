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
									stroke-width='11'
								/>
							</svg>
							<span className='font-bold'>fileslicker</span>
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
											<SheetTitle>По пивку? 🍺</SheetTitle>
											<SheetDescription>
												Пиво — слабоалкогольный напиток, получаемый спиртовым
												брожением солодового сусла (чаще всего на основе ячменя)
												с помощью пивных дрожжей, обычно с добавлением хмеля.
												Содержание этилового спирта (крепость) в большинстве
												сортов пива около 3,0—6,0% об. (крепкое содержит, как
												правило, от 8,5% до 14% об., иногда также выделяют
												лёгкое пиво, которое содержит 1—2% об., отдельно
												выделяют безалкогольное пиво, которое сюда не включают),
												сухих веществ (в основном углеводов) 7—10%, углекислого
												газа 0,48—1,0%. В пиве содержится более 800 соединений,
												которые определяют его вкус и аромат.
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
