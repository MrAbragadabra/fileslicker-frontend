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
import { complaintClose, getComplaints } from '@/lib/api'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ComplaintsPage() {
	const [complaints, setComplaints] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [closing, setClosing] = useState<number | null>(null)

	// Получение жалоб
	useEffect(() => {
		const fetchComplaints = async () => {
			const token = localStorage.getItem('token')
			if (token) {
				try {
					const data = await getComplaints(token)
					console.log(data)
					setComplaints(data)
				} catch {
					toast({ title: 'Не удалось загрузить жалобы.' })
				} finally {
					setLoading(false)
				}
			}
		}
		fetchComplaints()
	}, [])

	// Обработчик закрытия жалобы
	const handleCloseComplaint = async (id: number) => {
		setClosing(id)
		const token = localStorage.getItem('token')
		if (token) {
			try {
				await complaintClose(token, id)
				toast({ title: `Жалоба #${id} закрыта.` })
				// Обновление локального состояния жалобы
				setComplaints(prev =>
					prev.map(complaint =>
						complaint.id === id ? { ...complaint, is_closed: true } : complaint
					)
				)
			} catch {
				toast({ title: 'Не удалось закрыть жалобу.' })
			} finally {
				setClosing(null)
			}
		}
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Жалобы</h2>

			{/* Таблица */}
			{loading ? (
				<div className='flex justify-center'>
					<LoaderCircle className='animate-spin' />
				</div>
			) : (
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
						{complaints.map(complaint => (
							<TableRow key={complaint.id}>
								<TableCell>{complaint.id}</TableCell>
								<TableCell>
									<Link
										href={`/upload/${complaint.upload_id}`}
										className='text-blue-500 hover:underline'
									>
										Загрузка #{complaint.upload_id}
									</Link>
								</TableCell>
								<TableCell className='max-w-xs break-words'>
									{complaint.comment}
								</TableCell>
								<TableCell>
									{complaint.is_close ? 'Закрыта' : 'Открыта'}
								</TableCell>
								<TableCell>
									<Button
										variant='destructive'
										disabled={closing === complaint.id || complaint.is_close}
										onClick={() => handleCloseComplaint(complaint.id)}
									>
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
