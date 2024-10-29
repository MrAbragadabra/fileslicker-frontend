import Link from "next/link";

type LinkProps = {
	type: "link";
	href: string;
	className?: string;
	caption: string;
};

type TextProps = {
	type: "text";
	className?: string;
	caption: string;
};

type Props = LinkProps | TextProps;

export const NavigationElement = (props: Props) => {
	return (
		<>
			{props.type === "link" ? (
				<Link
					href={props.href}
					className={
						props.className ||
						"font-bold transition-colors hover:text-foreground/80 text-foreground/60"
					}
				>
					{props.caption}
				</Link>
			) : (
				<span
					className={
						props.className ||
						"font-bold transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
					}
				>
					{props.caption}
				</span>
			)}
		</>
	);
};
