'use client'

import { Button } from '@/components/ui/button' // Импорт кнопки
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table' // Импорт компонентов таблицы
import { toast } from '@/hooks/use-toast' // Импорт хука для уведомлений
import { complaintClose, getComplaints } from '@/lib/api' // Импорт функций API
import { LoaderCircle } from 'lucide-react' // Импорт иконки загрузки
import Link from 'next/link' // Импорт компонента Link для переходов
import { useEffect, useState } from 'react' // Импорт хука состояния и эффекта

export default function ComplaintsPage() {
	// Состояние для хранения списка жалоб
	const [complaints, setComplaints] = useState<any[]>([])

	// Состояние для индикатора загрузки
	const [loading, setLoading] = useState<boolean>(true)

	// Состояние для отслеживания процесса закрытия жалобы
	const [closing, setClosing] = useState<number | null>(null)

	// Эффект для загрузки жалоб при монтировании компонента
	useEffect(() => {
		// Асинхронная функция для получения жалоб
		const fetchComplaints = async () => {
			const token = localStorage.getItem('token') // Получение токена из localStorage
			if (token) {
				try {
					// Получаем список жалоб через API
					const data = await getComplaints(token)
					console.log(data) // Временный лог для отладки
					setComplaints(data) // Устанавливаем данные в состояние
				} catch {
					// Обработка ошибки загрузки данных
					toast({ title: 'Не удалось загрузить жалобы.' })
				} finally {
					// Завершаем процесс загрузки
					setLoading(false)
				}
			}
		}
		fetchComplaints() // Вызов функции загрузки
	}, [])

	// Функция для закрытия жалобы
	const handleCloseComplaint = async (id: number) => {
		setClosing(id) // Устанавливаем текущую жалобу как закрываемую
		const token = localStorage.getItem('token')
		if (token) {
			try {
				// Отправляем запрос на закрытие жалобы
				await complaintClose(token, id)
				toast({ title: `Жалоба #${id} закрыта.` })
				// Обновляем состояние жалоб, чтобы отразить изменение статуса
				setComplaints(prev =>
					prev.map(complaint =>
						complaint.id === id ? { ...complaint, is_closed: true } : complaint
					)
				)
			} catch {
				// Обработка ошибки при закрытии жалобы
				toast({ title: 'Не удалось закрыть жалобу.' })
			} finally {
				setClosing(null) // Завершаем процесс закрытия
			}
		}
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Жалобы</h2>

			{/* Отображаем индикатор загрузки, если данные еще не загружены */}
			{loading ? (
				<div className='flex justify-center'>
					<LoaderCircle className='animate-spin' />
				</div>
			) : (
				// Таблица с жалобами
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell className='font-semibold'>ID</TableCell>
							<TableCell className='font-semibold'>Загрузка</TableCell>
							<TableCell className='font-semibold'>Комментарий</TableCell>
							<TableCell className='font-semibold'>Статус</TableCell>
							<TableCell className='font-semibold'>Действия</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{/* Перебор всех жалоб и отображение их в строках таблицы */}
						{complaints.map(complaint => (
							<TableRow key={complaint.id}>
								<TableCell>{complaint.id}</TableCell>
								<TableCell>
									{/* Ссылка на загрузку, к которой относится жалоба */}
									<Link
										href={`/upload/${complaint.upload_id}`}
										className='text-blue-500 hover:underline'
									>
										Загрузка #{complaint.upload_id}
									</Link>
								</TableCell>
								<TableCell className='max-w-xs break-words'>
									{complaint.comment} {/* Комментарий к жалобе */}
								</TableCell>
								<TableCell>
									{/* Статус жалобы: открыта или закрыта */}
									{complaint.is_close ? 'Закрыта' : 'Открыта'}
								</TableCell>
								<TableCell>
									{/* Кнопка для закрытия жалобы */}
									<Button
										variant='destructive'
										disabled={closing === complaint.id || complaint.is_close} // Отключаем кнопку, если жалоба уже закрыта или в процессе закрытия
										onClick={() => handleCloseComplaint(complaint.id)}
									>
										{/* Показываем индикатор загрузки или текст кнопки в зависимости от состояния */}
										{closing === complaint.id ? (
											<LoaderCircle className='animate-spin' />
										) : complaint.is_close ? (
											'Закрыта'
										) : (
											'Закрыть'
										)}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
