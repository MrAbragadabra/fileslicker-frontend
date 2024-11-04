import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ChevronDown } from 'lucide-react'
import { LoginForm } from '../../forms/login'
import { SignUpForm } from '../../forms/signup'
import { Logo } from '../logo'

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
								<SignUpForm />
								<LoginForm />
							</div>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	)
}
