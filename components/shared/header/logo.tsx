import Link from 'next/link'

export const Logo = ({}) => {
	return (
		<Link className='flex items-center mr-4' href={'/'}>
			<svg
				className='h-6 w-6 mr-2'
				viewBox='0 0 140 140'
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
	)
}
