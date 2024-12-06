// Этот компонент является клиентским компонентом Next.js
'use client'

import { Button } from '@/components/ui/button' // Импортируем кнопку из компонентов UI
import { Table } from '@/components/ui/table' // Импортируем таблицу из компонентов UI
import { Textarea } from '@/components/ui/textarea' // Импортируем текстовую область из компонентов UI
import { toast } from '@/hooks/use-toast' // Хук для отображения уведомлений
import { addComplaint, getFiles } from '@/lib/api' // Функции для работы с API
import { zodResolver } from '@hookform/resolvers/zod' // Резолвер схемы Zod для React Hook Form
import { useParams, useRouter } from 'next/navigation' // Хуки для работы с навигацией
import { useEffect, useState } from 'react' // Хуки состояния и эффекта
import { useForm } from 'react-hook-form' // Хук формы
import { z } from 'zod' // Библиотека для валидации данных

// Интерфейс для описания структуры файла
interface File {
	id: number // Идентификатор файла
	upload_id: number // Идентификатор загрузки
	file_path: string // Путь к файлу
	file_size: number // Размер файла
	file_name: string // Имя файла
}

// Схема для валидации формы жалобы
const complaintSchema = z.object({
	comment: z
		.string()
		.min(1, { message: 'Комментарий не может быть пустым' }) // Минимальная длина комментария - 1 символ
		.max(
			1000,
			{ message: 'Комментарий не может быть длиннее 1000 символов' } // Максимальная длина комментария - 1000 символов
		),
})

// Тип значений формы жалобы
type ComplaintFormValues = z.infer<typeof complaintSchema>

// Основной компонент страницы загрузки
export default function UploadPage() {
	const { id } = useParams() // Получение параметра id из URL
	const router = useRouter() // Хук для редиректа
	const [files, setFiles] = useState<File[]>([]) // Список файлов
	const [loading, setLoading] = useState<boolean>(false) // Флаг загрузки

	// Настройка формы с использованием React Hook Form и схемы валидации
	const form = useForm<ComplaintFormValues>({
		resolver: zodResolver(complaintSchema), // Используем резолвер схемы Zod
		defaultValues: {
			comment: '', // Начальное значение поля комментария
		},
	})

	// Эффект для получения списка файлов при изменении параметра id
	useEffect(() => {
		if (id) {
			const fetchFiles = async () => {
				setLoading(true)
				try {
					const data = await getFiles(Number(id)) // Передача ID в запрос
					if (data.length === 0) {
						// Если файлов нет, редиректим на главную страницу
						router.push('/')
					} else {
						setFiles(data) // Обновляем список файлов
					}
				} catch (error) {
					console.error('Error fetching files:', error) // Логируем ошибку
					router.push('/') // В случае ошибки также редиректим на главную
				} finally {
					setLoading(false) // Завершаем загрузку
				}
			}

			fetchFiles()
		}
	}, [id, router])

	// Функция для скачивания файла
	const handleDownload = (filePath: string) => {
		const downloadUrl = `http://127.0.0.1:8000/storage/${filePath}` // Формируем URL для скачивания
		window.open(downloadUrl, '_blank') // Открываем файл в новой вкладке
	}

	// Обработчик отправки формы жалобы
	const onSubmit = async (data: ComplaintFormValues) => {
		try {
			await addComplaint({ comment: data.comment, upload_id: Number(id) }) // Отправка жалобы через API

			toast({
				title: 'Жалоба успешно добавлена!', // Уведомление об успешной отправке
			})

			form.reset() // Очищаем форму после отправки
		} catch (error) {
			console.error('Ошибка отправки жалобы:', error) // Логируем ошибку
		}
	}

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Загрузка №{id}</h1>{' '}
			{/* Заголовок страницы */}
			{loading ? (
				<p>Загрузка...</p> // Отображение сообщения о загрузке
			) : (
				<Table>
					{' '}
					{/* Таблица с файлами */}
					<thead>
						<tr>
							<th>Название</th> {/* Название столбца */}
							<th>Размер (MB)</th> {/* Размер файла в мегабайтах */}
							<th>Действие</th> {/* Действия над файлом */}
						</tr>
					</thead>
					<tbody>
						{files.map(
							(
								file // Проходимся по каждому файлу
							) => (
								<tr key={file.id}>
									{' '}
									{/* Уникальный ключ для строки таблицы */}
									<td>{file.file_name}</td> {/* Имя файла */}
									<td>{(file.file_size / 1024 / 1024).toFixed(4)} MB</td>{' '}
									{/* Размер файла в мегабайтах */}
									<td>
										<Button
											onClick={() => handleDownload(file.file_path)} // Кнопка для скачивания файла
											variant='outline'
										>
											Скачать
										</Button>
									</td>
								</tr>
							)
						)}
					</tbody>
				</Table>
			)}
			<hr className='my-8' /> {/* Горизонтальная линия-разделитель */}
			<h2 className='text-xl font-bold mb-4'>Оставить жалобу</h2>{' '}
			{/* Заголовок раздела жалобы */}
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<Textarea
					{...form.register('comment')} // Регистрация поля комментария
					placeholder='Введите текст жалобы'
					className='w-full'
				/>
				{form.formState.errors.comment && ( // Вывод ошибки валидации
					<p className='text-red-500'>
						{form.formState.errors.comment.message}
					</p>
				)}

				<Button
					type='submit'
					variant='destructive'
					disabled={form.formState.isSubmitting} // Блокировка кнопки при отправке
				>
					{form.formState.isSubmitting ? 'Отправка...' : 'Отправить жалобу'}{' '}
					{/* Текст кнопки */}
				</Button>
			</form>
		</div>
	)
}
