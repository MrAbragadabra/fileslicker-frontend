'use client'
import { getComplaints, getFilesAdmin, getUsersAdmin } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function SystemPage() {
	const [data, setData] = useState({
		usersCount: 0,
		filesCount: 0,
		totalFileSize: 0,
		complaintsCount: 0,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('token')
				if (!token) {
					throw new Error('Токен не найден')
				}

				const [users, files, complaints] = await Promise.all([
					getUsersAdmin(token),
					getFilesAdmin(token),
					getComplaints(token),
				])

				console.log('Files:', files) // Временный лог для отладки

				// Переводим размеры файлов в мегабайты и суммируем
				const totalFileSizeInMB = files
					.map((file: { file_size: number }) =>
						(file.file_size / 1024 / 1024).toFixed(4)
					)
					.reduce((acc: number, size: string) => acc + parseFloat(size), 0)

				setData({
					usersCount: users.length,
					filesCount: files.length,
					totalFileSize: totalFileSizeInMB, // Теперь в мегабайтах
					complaintsCount: complaints.length,
				})
			} catch (err: any) {
				setError(err.message || 'Не удалось загрузить данные')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return <p>Загрузка данных...</p>
	}

	if (error) {
		return <p className='text-red-500'>Ошибка: {error}</p>
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Состояние системы</h2>
			<ul className='list-disc ml-6'>
				<li>Количество пользователей: {data.usersCount}</li>
				<li>Количество загруженных файлов: {data.filesCount}</li>
				<li>Суммарный объём загруженных файлов: {data.totalFileSize} MB</li>
				<li>Количество жалоб: {data.complaintsCount}</li>
			</ul>
		</div>
	)
}
