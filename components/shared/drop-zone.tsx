'use client' // Указывает, что компонент является клиентским, то есть будет рендериться на клиенте

import { Progress } from '@/components/ui/progress' // Импортируем компонент Progress для отображения прогресса загрузки
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select' // Импортируем компоненты Select для выбора периода хранения
import { toast } from '@/hooks/use-toast' // Импортируем хук toast для отображения уведомлений
import { uploadFilesGuest, uploadFilesUser } from '@/lib/api' // Импортируем функции для загрузки файлов
import { AnimatePresence, motion } from 'framer-motion' // Импортируем анимации для отображения компонентов
import { CloudUpload } from 'lucide-react' // Импортируем иконку загрузки
import { useRouter } from 'next/navigation' // Импортируем useRouter для навигации
import { useState } from 'react' // Импортируем useState для состояния компонента
import { useDropzone } from 'react-dropzone' // Импортируем useDropzone для обработки перетаскивания файлов

export const Dropzone: React.FC = () => {
	const [files, setFiles] = useState<File[]>([]) // Состояние для хранения выбранных файлов
	const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
		{} // Состояние для хранения прогресса загрузки файлов
	)
	const [isUploading, setIsUploading] = useState(false) // Состояние для отслеживания процесса загрузки
	const [storagePeriod, setStoragePeriod] = useState('1h') // Состояние для хранения выбранного периода хранения файлов
	const router = useRouter() // Создаем экземпляр useRouter для навигации

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		// Настройки для обработки перетаскивания файлов
		onDrop: acceptedFiles => {
			// Обработчик при добавлении файлов
			if (acceptedFiles.length > 10) {
				toast({
					title: 'Максимум можно только 10 файлов!', // Если файлов больше 10, показываем уведомление
				})
				return
			}
			setFiles(acceptedFiles) // Устанавливаем выбранные файлы в состояние
		},
		multiple: true, // Разрешаем несколько файлов
	})

	const handleUpload = async () => {
		// Обработчик начала загрузки файлов
		setIsUploading(true) // Устанавливаем состояние загрузки в true
		try {
			const token = localStorage.getItem('token') // Получаем токен из localStorage
			const progress: Record<string, number> = {} // Объект для отслеживания прогресса загрузки каждого файла

			// Инициализируем прогресс для каждого файла
			files.forEach(file => {
				progress[file.name] = 0
			})
			setUploadProgress(progress)

			let response
			// Если токен есть, загружаем как пользователь, иначе как гость
			if (token) {
				// Для авторизованного пользователя
				response = await uploadFilesUser(
					token,
					{
						files,
						storage_period: storagePeriod,
					},
					{
						// Обработчик прогресса загрузки
						onUploadProgress: e => {
							const percentCompleted = e.total
								? Math.round((e.loaded * 100) / e.total) // Рассчитываем процент загрузки
								: Math.round((e.loaded * 100) / (files[0]?.size || 1)) // Для маленьких файлов используем их размер
							files.forEach(file => {
								progress[file.name] = percentCompleted // Обновляем прогресс для каждого файла
							})
							setUploadProgress({ ...progress }) // Обновляем состояние прогресса
						},
					}
				)
			} else {
				// Для незарегистрированного пользователя
				response = await uploadFilesGuest(
					{
						files,
						storage_period: storagePeriod,
					},
					{
						// Обработчик прогресса загрузки
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
				// Уведомление об успешной загрузке
				title: 'Файлы успешно загружены!',
				description: `Загружено файлов: ${files.length}`,
			})

			// Редирект на страницу загрузки с ID загрузки
			const uploadId = response.upload_id
			router.push(`/upload/${uploadId}`)
		} catch {
			toast({
				// Уведомление об ошибке
				title: 'Ошибка загрузки!',
				description: 'Не удалось загрузить файлы. Попробуйте позже.',
			})
		} finally {
			// Очистка состояния после завершения загрузки
			setIsUploading(false)
			setFiles([])
			setUploadProgress({})
		}
	}

	return (
		<div className='space-y-4'>
			<AnimatePresence>
				{/* Отображение области для перетаскивания файлов, если файлов еще нет */}
				{files.length === 0 && (
					<motion.div
						layout
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className={`cursor-pointer w-full h-[80vh] flex items-center justify-center border-4 ${
							isDragActive
								? 'border-dashed border-blue-500'
								: 'border-dashed border-gray-300'
						}`}
						{...getRootProps()} // Разрешаем взаимодействие с зоной перетаскивания
					>
						<input {...getInputProps()} />{' '}
						{/* Пропсы для input, чтобы пользователь мог выбрать файлы */}
						<div className='select-none flex space-x-4'>
							<span className='font-bold text-xl sm:text-2xl'>
								Бросьте файлы сюда или нажмите
							</span>
							<CloudUpload strokeWidth={2.25} size={40} />{' '}
							{/* Иконка загрузки */}
						</div>
					</motion.div>
				)}

				{/* Если файлы выбраны, отображаем информацию о них */}
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
							{/* Список файлов с их прогрессом загрузки */}
							{files.map(file => (
								<li key={file.name} className='flex items-center space-x-4'>
									<span className='truncate'>{file.name}</span>
									<Progress
										value={uploadProgress[file.name] || 0} // Прогресс для каждого файла
										className='w-full'
									/>
								</li>
							))}
						</ul>

						<div className='space-y-2'>
							<hr className='mb-2' />
							<label htmlFor='storage-period' className='font-medium'>
								Выберите период хранения:
							</label>
							<Select value={storagePeriod} onValueChange={setStoragePeriod}>
								<SelectTrigger id='storage-period'>
									<SelectValue placeholder='Выберите период' />
								</SelectTrigger>
								<SelectContent>
									{/* В зависимости от того, есть ли токен, показываем различные варианты хранения */}
									{localStorage.getItem('token') ? (
										<>
											<SelectItem value='1h'>1 час</SelectItem>
											<SelectItem value='12h'>12 часов</SelectItem>
											<SelectItem value='24h'>Сутки</SelectItem>
											<SelectItem value='72h'>Трое суток</SelectItem>
											<SelectItem value='168h'>Неделя</SelectItem>
											<SelectItem value='336h'>Две недели</SelectItem>
											<SelectItem value='720h'>Месяц</SelectItem>
										</>
									) : (
										<>
											<SelectItem value='1h'>1 час</SelectItem>
											<SelectItem value='12h'>12 часов</SelectItem>
											<SelectItem value='24h'>Сутки</SelectItem>
											<SelectItem value='72h'>Трое суток</SelectItem>
											<SelectItem value='168h'>Неделя</SelectItem>
										</>
									)}
								</SelectContent>
							</Select>
						</div>

						{/* Кнопка для начала загрузки */}
						<button
							onClick={handleUpload}
							disabled={isUploading} // Отключаем кнопку во время загрузки
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
