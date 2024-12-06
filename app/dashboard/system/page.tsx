'use client'

import { getComplaints, getFilesAdmin, getUsersAdmin } from '@/lib/api' // Импорт API функций
import { useEffect, useState } from 'react' // Импорт хуков состояния и эффекта

export default function SystemPage() {
	// Состояние для хранения данных о системе (пользователи, файлы, жалобы)
	const [data, setData] = useState({
		usersCount: 0,
		filesCount: 0,
		totalFileSize: 0,
		complaintsCount: 0,
	})

	// Состояние для загрузки данных
	const [loading, setLoading] = useState(true)

	// Состояние для хранения ошибок
	const [error, setError] = useState<string | null>(null)

	// Эффект для загрузки данных при монтировании компонента
	useEffect(() => {
		// Асинхронная функция для загрузки данных
		const fetchData = async () => {
			try {
				// Получаем токен из localStorage
				const token = localStorage.getItem('token')
				if (!token) {
					throw new Error('Токен не найден') // Если токен не найден, генерируем ошибку
				}

				// Загружаем данные о пользователях, файлах и жалобах параллельно
				const [users, files, complaints] = await Promise.all([
					getUsersAdmin(token), // Получение пользователей
					getFilesAdmin(token), // Получение файлов
					getComplaints(token), // Получение жалоб
				])

				// Временный лог для отладки (можно удалить)
				console.log('Files:', files)

				// Переводим размеры файлов в мегабайты и суммируем
				const totalFileSizeInMB = files
					.map(
						(file: { file_size: number }) =>
							(file.file_size / 1024 / 1024).toFixed(4) // Перевод размера файла в МБ
					)
					.reduce((acc: number, size: string) => acc + parseFloat(size), 0) // Суммируем все размеры файлов

				// Устанавливаем данные в состояние
				setData({
					usersCount: users.length, // Количество пользователей
					filesCount: files.length, // Количество файлов
					totalFileSize: totalFileSizeInMB, // Суммарный объём файлов в МБ
					complaintsCount: complaints.length, // Количество жалоб
				})
			} catch (err: any) {
				// Обработка ошибок
				setError(err.message || 'Не удалось загрузить данные')
			} finally {
				// Завершаем процесс загрузки
				setLoading(false)
			}
		}

		// Вызов асинхронной функции для получения данных
		fetchData()
	}, [])

	// Если данные загружаются
	if (loading) {
		return <p>Загрузка данных...</p> // Показываем индикатор загрузки
	}

	// Если произошла ошибка при загрузке данных
	if (error) {
		return <p className='text-red-500'>Ошибка: {error}</p> // Показываем сообщение об ошибке
	}

	// Отображение данных о системе
	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Состояние системы</h2>
			<ul className='list-disc ml-6'>
				<li>Количество пользователей: {data.usersCount}</li>{' '}
				{/* Количество пользователей */}
				<li>Количество загруженных файлов: {data.filesCount}</li>{' '}
				{/* Количество загруженных файлов */}
				<li>
					Суммарный объём загруженных файлов: {data.totalFileSize} MB
				</li>{' '}
				{/* Суммарный объём файлов */}
				<li>Количество жалоб: {data.complaintsCount}</li>{' '}
				{/* Количество жалоб */}
			</ul>
		</div>
	)
}
