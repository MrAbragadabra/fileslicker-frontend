import Link from 'next/link'

interface LinkProps {
	type?: 'link'
	href: string
	className?: string
	caption: string
}

interface TextProps {
	type: 'text'
	className?: string
	caption: string
}

type Props = LinkProps | TextProps

export const NavigationElement = (props: Props) => {
	const { className, caption, type = 'link' } = props

	if (type === 'link') {
		return (
			<Link
				href={(props as LinkProps).href}
				className={
					className ||
					'font-bold transition-colors hover:text-foreground/80 text-foreground/60'
				}
			>
				{caption}
			</Link>
		)
	} else {
		return (
			<span
				className={
					className ||
					'font-bold transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer'
				}
			>
				{caption}
			</span>
		)
	}
}
