import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ChevronDown } from 'lucide-react'
import { Logo } from '../logo'
import { NavigationElement } from './navigation-element'

interface Props {
	className?: string
}

export const MobileMenu = ({ className }: Props) => {
	return (
		<div className={className}>
			<Sheet>
				<SheetTrigger>
					<ChevronDown />
				</SheetTrigger>
				<SheetContent side={'left'}>
					<SheetHeader>
						<SheetTitle>
							<Logo />
						</SheetTitle>
						<SheetDescription>
							<div className='mt-6 space-y-6 flex-col text-xl'>
								<NavigationElement
									className='block font-bold transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer'
									type='text'
									caption='Создание аккаунта'
								/>
								<NavigationElement
									className='block font-bold transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer'
									type='text'
									caption='Вход'
								/>
							</div>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	)
}
