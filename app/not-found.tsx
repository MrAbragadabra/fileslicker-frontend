'use client'

import Link from 'next/link'

export default function NotFound() {
	return (
		<section className='w-full flex items-start justify-center'>
			<div className='flex-col items-center'>
				<Link className='flex items-center mr-4' href={'/'}>
					<svg
						className='h-8 w-8 sm:h-12 sm:w-12 mr-2'
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
					<span className='font-bold text-4xl sm:text-6xl'>fileslicker</span>
				</Link>
				<div className='mt-4'>
					<span className='text-2xl'>Кажется, вы потерялись - 404</span>
				</div>
			</div>
		</section>
	)
}
