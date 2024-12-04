'use client'
import { Progress } from '@/components/ui/progress'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { uploadFilesGuest, uploadFilesUser } from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudUpload } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export const Dropzone: React.FC = () => {
	const [files, setFiles] = useState<File[]>([])
	const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
		{}
	)
	const [isUploading, setIsUploading] = useState(false)
	const [storagePeriod, setStoragePeriod] = useState('1h')

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: acceptedFiles => {
			if (acceptedFiles.length > 10) {
				toast({
					title: 'Максимум можно только 10 файлов!',
				})
				return
			}
			setFiles(acceptedFiles)
		},
		multiple: true,
	})

	const handleUpload = async () => {
		setIsUploading(true)
		try {
			const token = localStorage.getItem('token') // Проверяем наличие токена в localStorage
			const progress: Record<string, number> = {}

			files.forEach(file => {
				progress[file.name] = 0
			})
			setUploadProgress(progress)

			if (token) {
				// Если токен есть, вызываем uploadFilesUser
				await uploadFilesUser(
					token,
					{
						files,
						storage_period: storagePeriod,
					},
					{
						onUploadProgress: e => {
							const percentCompleted = e.total
								? Math.round((e.loaded * 100) / e.total)
								: Math.round((e.loaded * 100) / (files[0]?.size || 1))
							files.forEach(file => {
								progress[file.name] = percentCompleted
							})
							setUploadProgress({ ...progress })
						},
					}
				)
			} else {
				// Если токена нет, вызываем uploadFilesGuest
				await uploadFilesGuest(
					{
						files,
						storage_period: storagePeriod,
					},
					{
						onUploadProgress: e => {
							const percentCompleted = e.total
								? Math.round((e.loaded * 100) / e.total)
								: Math.round((e.loaded * 100) / (files[0]?.size || 1))
							files.forEach(file => {
								progress[file.name] = percentCompleted
							})
							setUploadProgress({ ...progress })
						},
					}
				)
			}

			toast({
				title: 'Файлы успешно загружены!',
				description: `Загружено файлов: ${files.length}`,
			})
		} catch {
			toast({
				title: 'Ошибка загрузки!',
				description: 'Не удалось загрузить файлы. Попробуйте позже.',
			})
		} finally {
			setIsUploading(false)
			setFiles([])
			setUploadProgress({})
		}
	}

	return (
		<div className='space-y-4'>
			<AnimatePresence>
				{files.length === 0 && (
					/* eslint-disable */
					<motion.div
						layout
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className={`cursor-pointer w-full h-40 flex items-center justify-center border-4 ${
							isDragActive
								? 'border-dashed border-blue-500'
								: 'border-dashed border-gray-300'
						}`}
						{...getRootProps()}
					>
						<input {...getInputProps()} />
						<div className='select-none flex space-x-4'>
							<span className='font-bold text-xl sm:text-2xl'>
								Бросьте файлы сюда или нажмите
							</span>
							<CloudUpload strokeWidth={2.25} size={40} />
						</div>
					</motion.div>
					/* eslint-enable */
				)}

				{files.length > 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className='space-y-4'
						layout
					>
						<h3 className='text-lg font-medium'>Загружаемые файлы:</h3>
						<ul className='space-y-2'>
							{files.map(file => (
								<li key={file.name} className='flex items-center space-x-4'>
									<span className='truncate'>{file.name}</span>
									<Progress
										value={uploadProgress[file.name] || 0}
										className='w-full'
									/>
								</li>
							))}
						</ul>

						<div className='space-y-2'>
							<label htmlFor='storage-period' className='font-medium'>
								Выберите период хранения:
							</label>
							<Select value={storagePeriod} onValueChange={setStoragePeriod}>
								<SelectTrigger id='storage-period'>
									<SelectValue placeholder='Выберите период' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='1h'>1 час</SelectItem>
									<SelectItem value='12h'>12 часов</SelectItem>
									<SelectItem value='24h'>Сутки</SelectItem>
									<SelectItem value='72h'>Трое суток</SelectItem>
									<SelectItem value='168h'>Неделя</SelectItem>
									<SelectItem value='336h'>Две недели</SelectItem>
									<SelectItem value='720h'>Месяц</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<button
							onClick={handleUpload}
							disabled={isUploading}
							className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
						>
							{isUploading ? 'Загрузка...' : 'Начать загрузку'}
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
