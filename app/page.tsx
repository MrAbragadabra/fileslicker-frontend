'use client'

import { useRef } from 'react'

export default function Home() {
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	return (
		<section
			onClick={handleClick}
			className='rounded-lg border-4 border-dashed p-4 h-[85vh] flex items-center justify-center cursor-pointer'
		>
			<h1 className='block text-bold text-xl sm:text-4xl transition-colors text-foreground/60 cursor-pointer'>
				перетащите ваши файлы сюда (или просто нажмите)
			</h1>

			{/* Скрытый input для загрузки файлов */}
			<input
				type='file'
				ref={fileInputRef}
				style={{ display: 'none' }}
				multiple
			/>
		</section>
	)
}
