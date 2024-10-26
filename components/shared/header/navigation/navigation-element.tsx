import Link from 'next/link'

interface Props {
	href: string
	className?: string
	caption: string
}

export const NavigationElement = ({ href, className, caption }: Props) => {
	return (
		<Link href={href} className={className || 'font-bold transition-colors hover:text-foreground/80 text-foreground/60'}>
			{caption}
		</Link>
	)
}
