'use client'

import { Button } from '@/components/ui/button' // Импорт компонента кнопки
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table' // Импорт компонентов для таблицы
import { toast } from '@/hooks/use-toast' // Импорт хука для уведомлений
import { deleteUploadAdmin, getUploadsAdmin } from '@/lib/api' // Импорт функций для работы с API
import { LoaderCircle } from 'lucide-react' // Импорт иконки загрузки
import Link from 'next/link' // Импорт компонента для ссылок
import { useEffect, useState } from 'react' // Импорт хуков состояния и эффекта

export default function FilesPage() {
	// Состояние для списка загрузок, загрузки и удаления
	const [uploads, setUploads] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [deleting, setDeleting] = useState<number | null>(null)

	// Загрузка данных о загрузках при монтировании компонента
	useEffect(() => {
		// Получаем токен из localStorage
		const token = localStorage.getItem('token')
		if (token) {
			// Получаем данные о загрузках
			getUploadsAdmin(token)
				.then(data => {
					setUploads(data) // Сохраняем данные о загрузках
					setLoading(false) // Завершаем процесс загрузки
				})
				.catch(() => {
					setLoading(false) // Завершаем процесс загрузки при ошибке
					toast({ title: 'Не удалось загрузить данные о загрузках.' }) // Показываем ошибку
				})
		}
	}, [])

	// Удаление загрузки
	const handleDelete = (id: number) => {
		const token = localStorage.getItem('token')
		if (!token) {
			toast({ title: 'Не найден токен.' }) // Ошибка, если токен отсутствует
			return
		}
		setDeleting(id) // Устанавливаем состояние для загрузки удаления
		deleteUploadAdmin(id, token) // Удаляем загрузку
			.then(() => {
				setUploads(prev => prev.filter(upload => upload.id !== id)) // Обновляем список загрузок
				toast({ title: 'Загрузка успешно удалена!' }) // Показываем успех
			})
			.catch(() => {
				toast({ title: 'Не удалось удалить загрузку.' }) // Ошибка при удалении
			})
			.finally(() => setDeleting(null)) // Завершаем процесс удаления
	}

	// Функция для форматирования даты
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		})
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Загрузки</h2>

			{/* Отображение загрузки при ожидании данных */}
			{loading ? (
				<div className='flex justify-center'>
					<LoaderCircle className='animate-spin' />
				</div>
			) : (
				<Table className='min-w-full'>
					{/* Заголовок таблицы */}
					<TableHeader>
						<TableRow>
							<TableCell className='font-semibold'>ID</TableCell>
							<TableCell className='font-semibold'>Дата истечения</TableCell>
							<TableCell className='font-semibold'>Действия</TableCell>
						</TableRow>
					</TableHeader>
					{/* Тело таблицы с загрузками */}
					<TableBody>
						{uploads.map(upload => (
							<TableRow key={upload.id}>
								<TableCell>{upload.id}</TableCell>
								<TableCell>
									{formatDate(upload.expiration_date)}{' '}
									{/* Форматирование даты */}
								</TableCell>
								<TableCell>
									<div className='flex items-center'>
										{/* Ссылка на страницу загрузки */}
										<Link href={`/upload/${upload.id}`}>
											<Button variant='link'>Смотреть</Button>
										</Link>
										{/* Кнопка для удаления загрузки */}
										<Button
											variant='destructive'
											disabled={deleting === upload.id} // Отключаем кнопку, если идет процесс удаления
											onClick={() => handleDelete(upload.id)} // Обработчик удаления
										>
											{/* Индикатор загрузки или текст кнопки */}
											{deleting === upload.id ? (
												<LoaderCircle className='animate-spin mr-2' />
											) : (
												'Удалить'
											)}
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
