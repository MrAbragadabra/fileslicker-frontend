'use client'

import { toast } from '@/hooks/use-toast'
import { useRef, useState } from 'react'

export default function Home() {
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const dragCounter = useRef(0)

	const handleFiles = (files: FileList | null) => {
		if (files && files.length > 0) {
			const fileNames = Array.from(files)
				.map(file => file.name)
				.join(', ')

			toast({
				title: 'Вы прикрепили файлы',
				description: fileNames,
			})
		}
	}

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current += 1
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current -= 1
		if (dragCounter.current === 0) {
			setIsDragging(false)
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current = 0
		setIsDragging(false)

		const files = e.dataTransfer.files
		handleFiles(files)
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		handleFiles(files)
	}

	return (
		<section
			onClick={handleClick}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			className='rounded-lg border-4 border-dashed p-4 h-[85vh] flex items-center justify-center cursor-pointer'
		>
			<h1 className='block text-bold text-xl sm:text-4xl transition-colors text-foreground/60 cursor-pointer'>
				{isDragging
					? 'отпустите файлы'
					: 'перетащите ваши файлы сюда (или просто нажмите)'}
			</h1>

			<input
				type='file'
				ref={fileInputRef}
				className='hidden'
				multiple
				onChange={handleFileInputChange}
			/>
		</section>
	)
}
