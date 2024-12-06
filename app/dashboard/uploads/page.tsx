'use client'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { deleteUploadAdmin, getUploadsAdmin } from '@/lib/api'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function FilesPage() {
	const [uploads, setUploads] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [deleting, setDeleting] = useState<number | null>(null)

	useEffect(() => {
		// Получаем токен из localStorage
		const token = localStorage.getItem('token')
		if (token) {
			// Получаем данные о загрузках
			getUploadsAdmin(token)
				.then(data => {
					setUploads(data)
					setLoading(false)
				})
				.catch(() => {
					setLoading(false)
					toast({ title: 'Не удалось загрузить данные о загрузках.' })
				})
		}
	}, [])

	// Удаление загрузки
	const handleDelete = (id: number) => {
		const token = localStorage.getItem('token')
		if (!token) {
			toast({ title: 'Не найден токен.' })
			return
		}
		setDeleting(id)
		deleteUploadAdmin(id, token)
			.then(() => {
				setUploads(prev => prev.filter(upload => upload.id !== id))
				toast({ title: 'Загрузка успешно удалена!' })
			})
			.catch(() => {
				toast({ title: 'Не удалось удалить загрузку.' })
			})
			.finally(() => setDeleting(null))
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

			{/* Заголовок и таблица */}
			{loading ? (
				<div className='flex justify-center'>
					<LoaderCircle className='animate-spin' />
				</div>
			) : (
				<Table className='min-w-full'>
					<TableHeader>
						<TableRow>
							<TableCell className='font-semibold'>ID</TableCell>
							<TableCell className='font-semibold'>Дата истечения</TableCell>
							<TableCell className='font-semibold'>Действия</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{uploads.map(upload => (
							<TableRow key={upload.id}>
								<TableCell>{upload.id}</TableCell>
								<TableCell>
									{formatDate(upload.expiration_date)}
								</TableCell>
								<TableCell>
									<div className='flex items-center'>
										{/* Ссылка на саму загрузку */}
										<Link href={`/upload/${upload.id}`}>
											<Button variant='link'>Смотреть</Button>
										</Link>
										{/* Кнопка удаления */}
										<Button
											variant='destructive'
											disabled={deleting === upload.id}
											onClick={() => handleDelete(upload.id)}
										>
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
