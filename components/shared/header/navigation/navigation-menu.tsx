import { cn } from '@/lib/utils'
import { LoginForm } from '../../forms/login'
import { SignUpForm } from '../../forms/signup'

interface Props {
	className?: string
}

export const NavigationMenu = ({ className }: Props) => {
	return (
		<nav className={cn(className, 'space-x-6')}>
			<SignUpForm />
			<LoginForm />
		</nav>
	)
}
