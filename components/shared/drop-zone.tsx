'use client'
import { toast } from '@/hooks/use-toast'
import { uploadFilesGuest } from '@/lib/api'
import { CloudUpload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export const Dropzone: React.FC = () => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: async acceptedFiles => {
			if (acceptedFiles.length > 10) {
				toast({
					title: 'Максимум можно только 10 файлов!',
				})
				return
			}

			await uploadFilesGuest({
				files: acceptedFiles,
				storage_period: '1h',
			})
			toast({
				title: 'Файлы успешно загружены!',
			})
		},
		multiple: true, // Разрешить выбор нескольких файлов
	})

	return (
		<section
			className={`cursor-pointer w-full h-full flex items-center justify-center border-4 ${
				isDragActive
					? 'border-dashed border-blue-500'
					: 'border-dashed border-gray-300'
			}`}
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			<div className='select-none flex space-x-4'>
				<span className='font-bold text-xl sm:text-2xl'>
					Бросьте файлы здесь или нажмите
				</span>
				<CloudUpload strokeWidth={2.25} size={40} />
			</div>
		</section>
	)
}
